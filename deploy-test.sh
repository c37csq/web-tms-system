pnpm build:test

if [ ! -f dist/index.html  ];then
  echo '打包被中断，停止部署'
  exit 0
fi

project_name="tms"

echo -e "\033[41;37m 打包已经完成，正在打包压缩 \033[0m"
tar -zcf $project_name-dist.tar.gz dist/

echo -e "\033[36m 打包压缩完成，正在上传 \033[0m"
scp -i /Users/fzq/.ssh/id_rsa_1024 $project_name-dist.tar.gz root@"$1":/usr/share/nginx/onetouch-tech
echo -e "\033[42;37m 上传完成，开始部署 \033[0m"

# shellcheck disable=SC2087
ssh -i /Users/fzq/.ssh/id_rsa_1024 root@"$1" -tt << EOF

# 执行脚本创建文件夹
cd /usr/share/nginx/onetouch-tech
sh mkdir-bak.sh $project_name

mv -f /usr/share/nginx/onetouch-tech/$project_name/ /home/$project_name-web-bak/$(date +%Y%m%d)/
mv /home/$project_name-web-bak/$(date +%Y%m%d)/$project_name /home/$project_name-web-bak/$(date +%Y%m%d)/$project_name-$(date +%Y%m%d%H%M%S)

mkdir -p /usr/share/nginx/onetouch-tech/$project_name
tar -zxf /usr/share/nginx/onetouch-tech/$project_name-dist.tar.gz -C /usr/share/nginx/onetouch-tech/$project_name  --strip-components 1
rm -f /usr/share/nginx/onetouch-tech/$project_name-dist.tar.gz

exit
EOF

echo -e "\033[42;37m部署完成\033[0m"
echo -e "\033[31m删除本地压缩包\033[0m"
rm $project_name-dist.tar.gz
rm -rf dist/
