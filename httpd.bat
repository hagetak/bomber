@setlocal
@if not exist %~dp0httpd\http.conf goto :maybemoved
@cd %~dp0httpd
@"c:\Program Files\nodejs\node" http.js
@endlocal
@pause
exit

:maybemoved
@echo ���̃o�b�`�t�@�C�����R�s�[������ړ����Ă͂����܂���B
@echo ���������ꏊ�ɖ߂��Ă��������B
@pause
exit
