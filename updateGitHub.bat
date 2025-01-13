@echo off
color 0A
cls

echo ================================================
echo             MISE A JOUR GITHUB
echo ================================================
echo.

:: Vérifier si des modifications sont à commiter
echo Verification des modifications...
git status
echo.

:: Demander un message de commit personnalisé
set /p commit_msg="Message de commit (Enter pour 'Update'): "
if "%commit_msg%"=="" set commit_msg=Update

:: Ajouter les fichiers
echo.
echo Ajout des fichiers...
git add .
echo.

:: Créer le commit
echo Creation du commit...
git commit -m "%commit_msg%"
echo.

:: Pull avant push pour éviter les conflits
echo Recuperation des modifications distantes...
git pull origin main
echo.

:: Push des modifications
echo Envoi des modifications vers GitHub...
git push origin main
echo.

:: Vérifier si tout s'est bien passé
if %errorlevel% neq 0 (
    color 0C
    echo ================================================
    echo                    ERREUR
    echo    La mise a jour n'a pas pu etre effectuee
    echo ================================================
    pause
    exit /b 1
) else (
    echo ================================================
    echo              MISE A JOUR REUSSIE
    echo ================================================
)

:: Pause pour voir le résultat
pause 