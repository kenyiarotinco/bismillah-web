@AGENTS.md

# BISMILLAH — identidad del proyecto

Este repositorio es la **única fuente real** del sitio en producción:
https://bismillah.com.pe (alias de despliegue: bismillah-web-zeta.vercel.app).
Remoto oficial: `github.com/kenyiarotinco/bismillah-web.git`.

Existen otros directorios locales con nombres parecidos ("BISMILLAH",
"01_WEB", prototipos en D:\BISMILLAH) que **no** están conectados a este
dominio — son experimentos o prototipos descartados. Si no estás seguro de
estar en esta carpeta antes de editar, verifica:

    bash scripts/preflight-check.sh

Si el remoto Git no es `kenyiarotinco/bismillah-web`, este no es el
proyecto correcto — detente y confirma con el usuario en qué carpeta
quiere trabajar antes de tocar nada.

Un cambio no está "hecho" hasta que se hace commit (y, si el usuario lo
pide, push): lo que solo existe en el working tree local no afecta
bismillah.com.pe.
