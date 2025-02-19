


import { FC, forwardRef } from 'react';
import './index.less';

interface CardProps {
  children: React.ReactNode
  padding?: React.CSSProperties['padding']
  backgroundColor?: React.CSSProperties['backgroundColor']
  style?: React.CSSProperties
  classname?: string
}
const Card = forwardRef<HTMLDivElement, CardProps>((
  {
    children,
    padding = 24,
    backgroundColor = '#fff',
    style = {},
    classname = ''
  }: CardProps,
  ref
) => {
  return <div ref={ref} className={`white-label-admin-card ${classname}`} style={{ padding, backgroundColor, ...style }}>
    {children}
  </div>
})


export default Card;