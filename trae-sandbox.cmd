@echo off
setlocal EnableDelayedExpansion
set cmd=%*
if "!cmd:~0,1!"=="'" set cmd=!cmd:~1!
if "!cmd:~-1!"=="'" set cmd=!cmd:~0,-1!
powershell -NoProfile -ExecutionPolicy Bypass -Command "!cmd!"
endlocal
