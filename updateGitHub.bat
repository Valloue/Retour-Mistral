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
echo 3. Lier votre depot local au depot GitHub
echo q. Quitter
echo.
set /p choix="Choisissez une option (1-3 ou q pour quitter): "

if "%choix%"=="1" goto creer_depot
if "%choix%"=="2" goto pousser_projet
if "%choix%"=="3" goto lier_depot
if "%choix%"=="q" goto fin
goto menu

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
    :: Vérifier si origin existe déjà
    git remote -v | findstr "origin" > nul
    if errorlevel 1 (
        echo Le depot distant n'est pas configure.
        echo.
        set /p remote_url="Entrez le lien du depot GitHub: "
        echo.
        echo Ajout du depot distant...
        git remote add origin %remote_url%
        echo.
        echo Depot distant ajoute avec succes !
        echo.
    )
)

:: Vérifier la branche actuelle
for /f "tokens=* USEBACKQ" %%F in (`git rev-parse --abbrev-ref HEAD`) do set current_branch=%%F

:: Utiliser la bonne branche pour les commandes
echo Branch actuelle: %current_branch%
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

:: Pull avec l'option allow-unrelated-histories
echo Recuperation des modifications distantes...
git pull origin main --allow-unrelated-histories
echo.

:: Push des modifications
echo Envoi des modifications vers GitHub...
git push -u origin main
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
goto menu

:lier_depot
cls
echo ================================================
echo       LIAISON AVEC UN DEPOT GITHUB EXISTANT
echo ================================================
echo.
set /p remote_url="Entrez le lien du depot GitHub: "
echo.
echo Ajout du depot distant...
git remote add origin %remote_url%
echo.
echo Depot distant ajoute avec succes !
echo.
pause
goto menu

:fin
echo.
echo Au revoir !
timeout /t 2 >nul
exit