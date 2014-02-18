@setlocal
@if not exist %~dp0httpd\http.conf goto :maybemoved
@cd %~dp0httpd
@"c:\Program Files\nodejs\node" http.js
@endlocal
@pause
exit

:maybemoved
@echo このバッチファイルをコピーしたり移動してはいけません。
@echo 元あった場所に戻してください。
@pause
exit
