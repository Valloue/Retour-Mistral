@echo off
color 0A
cls

:menu
echo ================================================
echo             GESTION GITHUB
echo ================================================
echo.
echo 1. Creer un nouveau depot
echo 2. Pousser votre projet sur GitHub
echo q. Quitter
echo.
set /p choix="Choisissez une option (1-2 ou q pour quitter): "

if not "%choix%"=="1" if not "%choix%"=="2" if not "%choix%"=="q" (
    echo.
    echo Option invalide. Veuillez choisir 1, 2 ou q.
    echo.
    pause
    cls
    goto menu
)

if "%choix%"=="1" goto creer_depot
if "%choix%"=="2" goto pousser_projet
if "%choix%"=="q" goto fin

:creer_depot
cls
echo ================================================
echo          CREATION D'UN NOUVEAU DEPOT
echo ================================================
echo.
set /p depot_url="Entrez le lien du depot GitHub: "
echo.
echo Clonage du depot...
git clone %depot_url%
cd %~dp0
echo.
echo Initialisation du depot local...
git init
git branch -M main
echo.
echo Ajout des fichiers...
git add .
echo.
echo Creation du premier commit...
git commit -m "Premier commit"
echo.
pause
goto menu

:pousser_projet
cls
echo ================================================
echo             MISE A JOUR GITHUB
echo ================================================
echo.

:: Vérifier si le dépôt est initialisé
if not exist .git (
    echo Le depot Git n'est pas initialise.
    echo Veuillez d'abord lier votre depot.
    echo.
    set /p remote_url="Entrez le lien du depot GitHub: "
    echo.
    echo Initialisation du depot Git...
    git init
    git branch -M main
    echo.
    echo Ajout du depot distant...
    git remote add origin %remote_url%
    echo.
    echo Depot distant ajoute avec succes !
    echo.
) else (
    echo Mise a jour du depot distant...
    set /p remote_url="Entrez le lien du depot GitHub: "
    echo.
    git remote -v | findstr "origin" > nul
    if not errorlevel 1 (
        echo Suppression de l'ancien depot distant...
        git remote remove origin
        echo.
    )
    echo Ajout du nouveau depot distant...
    git remote add origin %remote_url%
    echo Depot distant mis a jour avec succes !
    echo.
)

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

:: Push des modifications avec force
echo Envoi des modifications vers GitHub...
git push -u origin main --force
echo.

:: Vérifier si tout s'est bien passé
if %errorlevel% neq 0 (
    color 0C
    echo ================================================
    echo                    ERREUR
    echo    La mise a jour n'a pas pu etre effectuee
    echo ================================================
    pause
    goto menu
) else (
    echo ================================================
    echo              MISE A JOUR REUSSIE
    echo ================================================
)
pause
cls
goto menu

:fin
echo.
echo Au revoir !
timeout /t 2 >nul
exit