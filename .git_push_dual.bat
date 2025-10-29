@echo off
setlocal

:: --- Script to push the current branch to both GitHub and GitLab ---
echo.
echo ====================================================
echo 🚀 Starting Dual Push for Current Branch...
echo ====================================================

:: --- Get Current Branch Name ---
for /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i
if "%CURRENT_BRANCH%"=="" (
    echo ❌ Could not determine current branch. Aborting.
    goto :eof
)
echo Current Branch: %CURRENT_BRANCH%
echo.

:: --- 1. Push to GitHub (Remote name: 'github') ---
echo ➡️ Pushing to GitHub (remote 'github')...
git push github %CURRENT_BRANCH% || (
    echo ❌ GitHub Push FAILED!
)
echo.

:: --- 2. Push to GitLab (Remote name: 'gitlab') ---
echo ➡️ Pushing to GitLab (remote 'gitlab')...
git push gitlab %CURRENT_BRANCH% || (
    echo ❌ GitLab Push FAILED!
)
echo.

echo ====================================================
echo ✅ Dual push script finished.
echo ====================================================

endlocal