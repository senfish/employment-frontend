# employment-frontend

## 员工信息录入系统

### 录入模块

- 支持上传身份证、银行卡照片，OCR 智能识别卡号回填

### 员工管理模块

- 支持员工信息的增删改查
- 支持员工信息的导出

## deploy

### build

```
docker build -t employment-fe .
```

### stop

```
docker stop employment-fe
docker rm employment-fe
```

### run

```
docker run -d -p 80:80 --name employment-fe employment-fe
```

后续考虑用 `docker-compose` 来部署
