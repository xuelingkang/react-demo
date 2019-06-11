:: 将编译好的文件打包到桌面
@echo off
:: 最终压缩包路径
set zipFile=%USERPROFILE%\Desktop\build.zip
:: 编译输出目录
set buildDir=%cd%\build
:: zip程序路径
set zipExe=%cd%\win\zip.exe

:: 删除编译输出目录
if exist %buildDir% (
echo clean %buildDir%
echo.
call rd/s/q %buildDir%
)
:: 删除原有压缩包
if exist %zipFile% (
echo clean %zipFile%
echo.
call del %zipFile%
)
:: 编译
echo build...
echo.
call npm run-script build
:: 压缩
echo compress...
echo.
cd %buildDir%
call %zipExe% -r %zipFile% .\
:: 完成
echo.
echo complete...
pause>null
