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
echo 3. Verifier les conflits
echo 4. Expliquer les conflits
echo 5. Exporter le projet en ZIP
echo q. Quitter
echo.
set /p choix="Choisissez une option (1-5 ou q pour quitter): "

if "%choix%"=="1" goto creer_depot
if "%choix%"=="2" goto pousser_projet
if "%choix%"=="3" goto verifier_conflits
if "%choix%"=="4" goto expliquer_conflits
if "%choix%"=="5" goto exporter_zip
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
    git init
    git branch -M main
)

:: Configurer le remote
echo Configuration du depot distant...
set /p remote_url="Entrez le lien du depot GitHub: "
git remote remove origin 2>nul
git remote add origin %remote_url%
echo.

:: Ajouter et commiter les modifications
echo Ajout des fichiers...
git add .
echo.

echo Creation du commit...
set /p commit_msg="Message de commit (Enter pour 'Update'): "
if "%commit_msg%"=="" set commit_msg=Update
git commit -m "%commit_msg%"
echo.

:: Push avec force
echo Envoi des modifications vers GitHub...
git push -u origin main --force
echo.

if %errorlevel% neq 0 (
    color 0C
    echo ================================================
    echo                    ERREUR
    echo    La mise a jour n'a pas pu etre effectuee
    echo ================================================
) else (
    echo ================================================
    echo              MISE A JOUR REUSSIE
    echo ================================================
)

pause
cls
goto menu

:verifier_conflits
cls
echo ================================================
echo          VERIFICATION DES CONFLITS
echo ================================================
echo.
echo Verification des conflits potentiels...
git fetch origin
git merge-base --is-ancestor HEAD origin/main
if %errorlevel% neq 0 (
    echo Des conflits potentiels ont ete detectes !
    git status
) else (
    echo Aucun conflit detecte.
)
pause
goto menu

:expliquer_conflits
cls
echo ================================================
echo          EXPLICATION DES CONFLITS
echo ================================================
echo.
echo Analyse des conflits...

:: Vérifier si origin existe
git remote -v | findstr "origin" > nul
if %errorlevel% neq 0 (
    echo Erreur: Aucun depot distant configure.
    echo Veuillez d'abord configurer votre depot avec l'option 2.
    pause
    goto menu
)

git fetch origin
git status | findstr "both modified:" > temp.txt
if %errorlevel% neq 0 (
    echo Aucun conflit detecte.
) else (
    echo Fichiers en conflit trouves :
    echo.
    type temp.txt
    echo.
    echo ------------------------------------------------
    echo Comment lire les conflits :
    echo.
    echo 1. Les lignes entre <<<<<<< HEAD et =======
    echo    sont vos modifications locales
    echo.
    echo 2. Les lignes entre ======= et >>>>>>>
    echo    sont les modifications distantes
    echo.
    echo 3. Vous devez choisir quelles modifications garder
    echo    ou comment les fusionner
    echo.
    echo Pour resoudre manuellement :
    echo 1. Ouvrez les fichiers en conflit
    echo 2. Cherchez les marqueurs <<<<<<< et >>>>>>>
    echo 3. Editez le contenu comme souhaite
    echo 4. Sauvegardez et faites un nouveau commit
)
del temp.txt 2>nul
pause
goto menu

:exporter_zip
cls
echo ================================================
echo          EXPORT DU PROJET EN ZIP
echo ================================================
echo.
set /p nom_zip="Nom du fichier ZIP (sans extension): "
echo Creation de l'archive %nom_zip%.zip...
git archive --format=zip HEAD > "%nom_zip%.zip"
echo Export termine avec succes !
pause
goto menu

:fin
echo.
echo Au revoir !
timeout /t 2 >nul
exit