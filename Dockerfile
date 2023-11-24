FROM python:3.8

# 定义工作目录
WORKDIR /app

# 复制项目
COPY epicengine /app

# 
RUN python -m pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple \
    && pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple \
    && pip install --no-cache-dir itsdangerous==0.24 -i https://pypi.tuna.tsinghua.edu.cn/simple

EXPOSE 5000

ENTRYPOINT ["python","manage.py"]


