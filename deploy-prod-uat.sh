pnpm build

if [ ! -f dist/index.html  ];then
  echo '打包被中断，停止部署'
  exit 0
fi

echo -e "\033[41;37m 打包已经完成，正在打包压缩 \033[0m"
tar -zcf dist.tar.gz dist/
rm -rf dist/

echo -e "\033[36m 打包压缩完成，正在上传 \033[0m"
scp -i /Users/fzq/.ssh/id_rsa_1024  -r dist.tar.gz root@"$1":/home/
echo -e "\033[42;37m 上传完成，开始部署 \033[0m"

# shellcheck disable=SC2087
ssh -i /Users/fzq/.ssh/id_rsa_1024 root@"$1" -tt << EOF

# 进入备份目录并执行脚本创建文件夹
cd /home/tms-web-bak
sh mkdir-dir.sh

# 进入通过脚本创建的目录并创建一个新的文件夹
cd /home/tms-web-bak/$(date +%Y%m%d)/
mkdir web

# 移动部署目录下的所有文件至备份文件中并重命名文件
mv /home/web/*  /home/tms-web-bak/$(date +%Y%m%d)/web
mv web web-$(date +%Y%m%d%H%M%S)

# 移动打包好的文件至部署目录
cd /home/web
mv /home/dist.tar.gz /home/web
tar -zxf dist.tar.gz --strip-components 1
rm -f dist.tar.gz
exit
EOF

echo -e "\033[42;37m 部署完成 \033[0m"
rm dist.tar.gz
