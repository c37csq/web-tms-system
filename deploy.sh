echo "正在部署 TMS 项目，请选择要部署的环境:"
# sit 123.60.21.193 / demo 123.60.49.175 / uat 119.8.43.33 / prod 159.138.4.201
select env in "SIT环境" "DEMO环境" "UAT环境" "PROD环境"
do
  case $env in
  "SIT环境")
      echo "开始打包部署 ======== [SIT环境]"
      sh ./deploy-test.sh 123.60.21.193
      break;
    ;;
  "DEMO环境")
      echo "开始打包部署 ======== [DEMO环境]"
      sh ./deploy-test.sh 123.60.49.175
    break;
    ;;
  "UAT环境")
      echo "开始打包部署 ======== [UAT环境环境]"
      sh ./deploy-prod-uat.sh 119.8.43.33
    break;
    ;;
  "PROD环境")
      read -r -p "请确认是否要包 PROD 生产环境！！！！！！? [Y/n] " input
      case $input in
          [yY][eE][sS]|[yY])
            echo "开始打包部署 ======== [PROD环境]"
            sh ./deploy-prod-uat.sh 159.138.4.201
          ;;

          [nN][oO]|[nN])
            exit 1
          ;;

          *)
            echo "请输入[Y/n]"
            exit 1
          ;;
      esac
    break;
    ;;
  *)
      echo "请选择正确的环境"
      ;;
  esac
done;
