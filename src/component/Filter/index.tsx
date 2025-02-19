/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { FC, forwardRef, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import './index.less';
import { Button, Form, FormInstance } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";

export interface TableFilterItem {
  field: string,
  label: string | React.ReactNode
  component: React.ReactNode
}
export interface TableFilterProps {
  items: TableFilterItem[]
  colNum?: number
  form?: FormInstance
  onSearch?: (params: Record<string, never>) => void
  onReset?: () => void
  size?: SizeType
  getContentRect?: (rect: DOMRect) => void
}

const LABEL_RIGHT = 12;
const LABEL_ITEM = 100;
const MIN_ITEM_WIDTH = 312; // 最小宽度 100 + 12 + 200
const MAX_ITEM_WIDTH = 412; // 最大宽度 100 + 12 + 300
const DEFAULT_FILTER_WIDTH = 1044;
const DEAULT_COL_NUM = 4;


const TableFilter = forwardRef<HTMLDivElement, TableFilterProps>((props, ref) => {
  const { items, colNum, form: formProps, onSearch, onReset, size = 'middle', getContentRect } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const refItem = useRef<HTMLDivElement | null>(null);
  const [colWidth, setColWidth] = useState<number>(0);
  const [_colNum, setColNum] = useState<number>(0);
  const [form] = Form.useForm();
  const formInstance = formProps ?? form
  const calculateColWidth = (clientWidth: number = DEFAULT_FILTER_WIDTH) => {
    if (colNum) {
      const colWidth = Math.max(MIN_ITEM_WIDTH, clientWidth / colNum);
      return [colNum, colWidth];
    }
    let _colNum = Math.min(
      Math.floor(clientWidth / MIN_ITEM_WIDTH), //
      DEAULT_COL_NUM // 4
    );
    const min = Math.floor(clientWidth / MIN_ITEM_WIDTH);
    const max = Math.floor(clientWidth / MAX_ITEM_WIDTH);
    // const _colNum = Math.max(
    //   Math.floor(clientWidth / MAX_ITEM_WIDTH), //
    //   DEAULT_COL_NUM, // 4
    //   // Math.floor(clientWidth / MIN_ITEM_WIDTH)
    // );

    // 如果min > max, 要显示3个
    if (min > max) {
      _colNum = min
    }
    // 当算出来min、max之后，如果超过了item的个数，说明一行可以放得下
    if (min > items.length || max > items.length) {
      _colNum = Math.min(min, max)
    }
    // const maxColNum = Math.floor(clientWidth / MAX_ITEM_WIDTH)
    // console.log('maxColNum: ', maxColNum);
    // console.log('_colNum: ', _colNum);

    let colWidth = Math.floor(clientWidth / _colNum);
    if (colWidth > MAX_ITEM_WIDTH) {
      // 大了的话还需要继续计算
      const tempColNum = _colNum + 1;
      const tempColWidth = Math.floor(clientWidth / (tempColNum));
      if (tempColWidth > MIN_ITEM_WIDTH) {
        _colNum = tempColNum;
        colWidth = tempColWidth;
      }
    }
    return [_colNum, colWidth];
  };
  useEffect(() => {
    if (!wrapperRef.current) return;
    const { width } = wrapperRef.current.getBoundingClientRect();
    // console.log('width: ', width);
    const [newColNum, newWidth] = calculateColWidth(width);
    setColWidth(newWidth);
    setColNum(newColNum);
  }, [items]);

  useEffect(() => {
    const resizeObs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // console.log('entry.contentRect', entry.contentRect);
        // getContentRect(entry?.contentRect)
        const [newColNum, newWidth] = calculateColWidth(
          entry.contentRect.width,
        );
        setColWidth(newWidth);
        setColNum(newColNum);
      }
    });
    resizeObs.observe(wrapperRef.current!);
    return () => {
      if (wrapperRef.current) {
        resizeObs && resizeObs.disconnect();
      }
    };
  }, [wrapperRef.current, items]);

  const componentWidth = useMemo(() => {
    const targetWidth = colWidth - LABEL_ITEM - LABEL_RIGHT || 0;
    // return colWidth - LABEL_ITEM - LABEL_RIGHT || 0;
    return targetWidth;
  }, [colWidth, _colNum]);

  const paddingRightWidth = useMemo(() => {
    // 当视图宽度 > colwidth * _colNum (也可以理解当前的colwidth已经超出了最大的宽度412时)
    // 说明flex布局有空闲，需要paddingRight缩进
    if (!wrapperRef.current) return 0;
    const { width } = wrapperRef.current.getBoundingClientRect();
    if (width > MAX_ITEM_WIDTH * _colNum) {
      return width - MAX_ITEM_WIDTH * _colNum
    }
  }, [_colNum, wrapperRef.current?.getBoundingClientRect()?.width]);
  const handleSearch = () => {
    onSearch?.(form.getFieldsValue());
  }
  const handleReset = () => {
    form.resetFields();
    onReset?.()
  }
  return <div className="table-filter" ref={ref}>
    <Form form={formInstance}>
      <div className="table-filter-wrapper" ref={wrapperRef}>
        {
          items.map(item => {
            return <div
              key={item.field}
              className="table-filter-item"
              ref={refItem}
              style={{
                maxWidth: MAX_ITEM_WIDTH,
                minWidth: MIN_ITEM_WIDTH,
              }}
            >
              <label
                className="table-filter-label"
                style={{
                  width: LABEL_ITEM,
                  marginRight: LABEL_RIGHT
                }}
              >
                {item.label}
              </label>
              <div
                className="table-filter-component"
                style={{
                  maxWidth: 300,
                  minWidth: 200,
                  width: componentWidth
                }}
              >
                <Form.Item name={item.field} noStyle>
                  {React.cloneElement(item.component as ReactElement, {
                    size,
                    style: {
                      width: '100%'
                    }
                  })}
                </Form.Item>
              </div>
            </div>
          })
        }
        <div
          className="table-filter-item"
          style={{
            flex: 1,
            maxWidth: 412,
            minWidth: 312,
            width: colWidth,
            marginLeft: 'auto'
          }}
        >
          <div className="table-filter-actions" style={{ paddingRight: paddingRightWidth }}>
            <Button size={size} onClick={handleReset}>重置</Button>
            <Button size={size} type='primary' onClick={handleSearch}>查询</Button>
          </div>
        </div>
      </div>
    </Form>
  </div>
})

export default TableFilter;