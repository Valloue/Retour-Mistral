@echo off
echo ========================================
echo    Mise a jour du projet sur GitHub
echo ========================================
echo.

:: Vérifier s'il y a des modifications
git status

echo.
echo ========================================
echo    Ajout des fichiers modifies
echo ========================================
git add .

echo.
set /p commit_message="Message du commit: "

:: Créer le commit avec le message
git commit -m "%commit_message%"

echo.
echo ========================================
echo    Push vers GitHub
echo ========================================
git push origin main

echo.
echo ========================================
echo    Mise a jour terminee
echo ========================================
pause 