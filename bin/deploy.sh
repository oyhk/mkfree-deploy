#!/bin/sh
currentRootPath=$(pwd) # 项目的跟路劲
cd ${currentRootPath}
git checkout .
git pull

FRONTEND_HOME=${currentRootPath}/mkfree-deploy-frontend # 前端项目路劲
APP_HOME=${currentRootPath}/mkfree-deploy-backend # 后端项目路劲
APP_MAINCLASS=mkfree-deploy-backend-1.0.0.jar
psid=0
checkpid() {
   javaps=`jps -l | grep $APP_MAINCLASS`
   if [ -n "$javaps" ]; then
      psid=`echo $javaps | awk '{print $1}'`
   else
      psid=0
   fi
}
start() {
   # 构建 react
   cd ${FRONTEND_HOME} && NODE_ENV=prod npm run build

   checkpid
   if [ $psid -ne 0 ]; then
      echo "================================"
      echo "warn: $APP_MAINCLASS already started! (pid=$psid)"
      echo "================================"
   else
      # 构建 java
      cd $APP_HOME && /mnt/usr/module/maven/current/bin/mvn clean package

      echo -n "Starting $APP_MAINCLASS ..."
      cd $APP_HOME
      nohup java -jar $APP_HOME/target/$APP_MAINCLASS --spring.profiles.active=prod >/dev/null 2>&1 &
      checkpid
      if [ $psid -ne 0 ]; then
         echo "(pid=$psid) [OK]"
      else
         echo "[Failed]"
      fi
   fi
}
stop() {
   checkpid
   if [ $psid -ne 0 ]; then
      echo -n "Stopping $APP_MAINCLASS ...(pid=$psid) "
      kill -9 $psid
      if [ $? -eq 0 ]; then
         echo "[OK]"
      else
         echo "[Failed]"
      fi

      checkpid
      if [ $psid -ne 0 ]; then
         stop
      fi
   else
      echo "================================"
   fi
}
case "$1" in
   'start')
      start
      ;;
   'stop')
     stop
     ;;
   'restart')
     stop
     start
     ;;
   'status')
     status
     ;;
   'info')
     info
     ;;
  *)
     echo "Usage: $0 {start|stop|restart}"
     exit 1
esac
exit 0
