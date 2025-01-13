@echo off
echo ========================================
echo    Mise a jour de Git
echo ========================================
git add .
git commit -m "Update"
echo.
echo ========================================
echo    Pull depuis GitHub
echo ========================================
git pull origin main
echo.
echo ========================================
echo    Push vers GitHub
echo ========================================
git push origin main
echo.
echo ========================================
echo    Mise a jour terminee
echo ========================================
