<# : batch portion
@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM ----------------------------------------------------------------------------

@echo off
setlocal

set WRAPPER_DIR=%~dp0
set DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip"

for /F "usebackq tokens=1,* delims==" %%A in ("%WRAPPER_DIR%.mvn\wrapper\maven-wrapper.properties") do (
    if "%%A"=="distributionUrl" set DOWNLOAD_URL=%%B
)

set DOWNLOAD_URL=%DOWNLOAD_URL:\=%
for %%F in ("%DOWNLOAD_URL%") do set DIST_ZIP=%%~nxF
for %%F in ("%DIST_ZIP:~0,-8%") do set DIST_NAME=%%~nxF

set MAVEN_USER_HOME=%USERPROFILE%\.m2
set MAVEN_HOME=%MAVEN_USER_HOME%\wrapper\dists\%DIST_NAME%

if exist "%MAVEN_HOME%\bin\mvn.cmd" goto execute

echo Downloading %DOWNLOAD_URL% ...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference = 'Stop'; " ^
    "New-Item -ItemType Directory -Force -Path '%MAVEN_USER_HOME%\wrapper\dists' | Out-Null; " ^
    "$zipPath = '%MAVEN_USER_HOME%\wrapper\dists\%DIST_ZIP%'; " ^
    "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile $zipPath; " ^
    "Expand-Archive -Path $zipPath -DestinationPath '%MAVEN_USER_HOME%\wrapper\dists' -Force; " ^
    "Remove-Item $zipPath -Force"

:execute
call "%MAVEN_HOME%\bin\mvn.cmd" %*
endlocal
exit /b %ERRORLEVEL%
#>

