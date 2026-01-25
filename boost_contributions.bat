@echo off
for /L %%i in (1,1,20) do (
   echo Contribution entry %%i >> activity_log.txt
   git add activity_log.txt
   git commit -m "chore: activity log update %%i"
   echo Committed change %%i
)
echo Done!
