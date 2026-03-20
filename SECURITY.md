# Documentación de Seguridad - Pagine Azzurre

Este documento describe las mejoras de seguridad implementadas en la plataforma Pagine Azzurre.

## Resumen de Mejoras Implementadas

Se han implementado las siguientes mejoras de seguridad críticas en la plataforma:

### 1. ✅ Gestión de Claves API y Secretos

**Problema Identificado:**
- Claves API de Infura hardcodeadas en el código frontend
- JWT secret con fallback inseguro a valor por defecto
- Configuración sensible expuesta en el código fuente

**Solución Implementada:**
- ✅ Movidas todas las claves API a variables de entorno
- ✅ Creado archivo `.env.example` con documentación de todas las variables requeridas
- ✅ Configuración de Web3/Infura ahora se obtiene desde el backend mediante endpoint seguro `/api/config/web3`
- ✅ Frontend refactorizado para usar configuración del backend en lugar de claves hardcodeadas

**Archivos Modificados:**
- `.env.example` (nuevo)
- `backend/server.js` - Añadido endpoint `/api/config/web3`
- `frontend/src/screens/ProfileScreen.js` - Refactorizado para usar configuración del backend
- `frontend/src/screens/PaymentMethodScreen.js` - Refactorizado para usar configuración del backend

**Instrucciones:**
```bash
# Generar JWT_SECRET seguro
openssl rand -base64 32

# Configurar en archivo .env
JWT_SECRET=tu-clave-segura-generada
WEB3_INFURA_URL=wss://goerli.infura.io/ws/v3/TU_PROJECT_ID
```

---

### 2. ✅ Protección de Endpoints de Seed

**Problema Identificado:**
- Endpoints `/api/users/seed` y `/api/products/seed` accesibles públicamente
- Permitían crear usuarios y productos sin autenticación
- Riesgo de seguridad crítico en producción

**Solución Implementada:**
- ✅ Creado middleware `isDevelopment` que protege endpoints sensibles
- ✅ Endpoints de seed solo accesibles en modo desarrollo
- ✅ En producción, requieren variable de entorno `ALLOW_SEED=true` (no recomendado)
- ✅ Error 403 con mensaje claro si se intenta acceder en producción

**Archivos Modificados:**
- `backend/utils.js` - Añadido middleware `isDevelopment`
- `backend/routers/userRouter.js` - Aplicado middleware a `/seed`
- `backend/routers/productRouter.js` - Aplicado middleware a `/seed`
- `.env.example` - Documentada variable `ALLOW_SEED`

**Configuración:**
```env
# Solo en desarrollo
NODE_ENV=development

# En producción (NO RECOMENDADO)
NODE_ENV=production
ALLOW_SEED=false
```

---

### 3. ✅ Validación de Inputs

**Problema Identificado:**
- Sin validación de datos de entrada del usuario
- Riesgo de inyección SQL/NoSQL
- Datos malformados podían causar errores en la aplicación
- Falta de validación de Codice Fiscale italiano

**Solución Implementada:**
- ✅ Instalado `express-validator` para validación robusta
- ✅ Creado archivo de validadores centralizados
- ✅ Validaciones aplicadas a endpoints críticos:
  - Registro de usuarios (`validateRegister`)
  - Login (`validateLogin`)
  - Actualización de perfil (`validateProfileUpdate`)
  - Creación/actualización de productos (`validateProduct`)
  - Creación de órdenes (`validateOrder`)

**Validaciones Implementadas:**
- **Username:** 3-30 caracteres, solo alfanuméricos, guiones y guiones bajos
- **Email:** Formato válido, normalizado
- **Password:** Mínimo 8 caracteres, requiere mayúsculas, minúsculas y números
- **Teléfono:** Formato internacional válido
- **Codice Fiscale:** 16 caracteres, formato italiano válido
- **Partita IVA:** 11 dígitos
- **CAP (Código Postal):** 5 dígitos
- **Productos:** Validación de precio, stock, descripción

**Archivos Creados/Modificados:**
- `backend/middlewares/validators.js` (nuevo) - Validadores centralizados
- `backend/routers/userRouter.js` - Aplicadas validaciones
- `backend/routers/productRouter.js` - Aplicadas validaciones

**Ejemplo de Uso:**
```javascript
// En el router
userRouter.post('/register', validateRegister, async (req, res) => {
  // Si llegamos aquí, los datos están validados
});
```

**Mensajes de Error:**
Los errores de validación se devuelven en formato estructurado:
```json
{
  "message": "Errori di validazione",
  "errors": [
    {
      "field": "email",
      "message": "Inserisci un indirizzo email valido"
    }
  ]
}
```

---

### 4. ✅ Filtrado de Datos Sensibles

**Problema Identificado:**
- **CRÍTICO:** Claves privadas de blockchain (`accountKey`) expuestas en respuestas API
- Contraseñas hasheadas potencialmente expuestas
- Datos sensibles enviados a usuarios no autorizados

**Solución Implementada:**
- ✅ Añadido método `toJSON()` al modelo de User para excluir automáticamente:
  - `accountKey` (clave privada blockchain)
  - `password` (contraseña hasheada)
  - `recoveryPasswordId` (token de recuperación)
- ✅ Aplicado `.toJSON()` en todas las respuestas que envían datos de usuario
- ✅ Protegidos endpoints públicos como `/sellers` y `/top-sellers`
- ✅ Protegidos endpoints de administración

**Archivos Modificados:**
- `backend/models/userModel.js` - Añadido método `toJSON()`
- `backend/routers/userRouter.js` - Aplicado sanitización en 7 endpoints

**Antes (INSEGURO):**
```javascript
// Exponía TODOS los campos incluyendo accountKey
res.send(user);
```

**Después (SEGURO):**
```javascript
// Automáticamente excluye campos sensibles
res.send(user.toJSON());
```

**Campos Protegidos:**
- ❌ `accountKey` - Nunca expuesto
- ❌ `password` - Nunca expuesto
- ❌ `recoveryPasswordId` - Nunca expuesto
- ✅ Otros campos - Expuestos según sea apropiado

---

### 5. ✅ Seguridad JWT Mejorada

**Problema Identificado:**
- JWT_SECRET con fallback inseguro a `'somethingsecret'`
- Tokens expiraban en 1 día (mala UX)
- Sin validación de existencia de JWT_SECRET en producción

**Solución Implementada:**
- ✅ Función `getJWTSecret()` que:
  - En desarrollo: Permite fallback con advertencia en consola
  - En producción: Falla con error fatal si JWT_SECRET no está configurado
- ✅ Expiración de tokens extendida a 30 días para mejor UX
- ✅ Mismo secret usado consistentemente en generación y verificación

**Archivos Modificados:**
- `backend/utils.js` - Refactorizada gestión de JWT_SECRET

**Comportamiento:**
```javascript
// Desarrollo sin JWT_SECRET
⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!

// Producción sin JWT_SECRET
❌ FATAL: JWT_SECRET environment variable is not set. Please set it before starting the server.
```

---

### 6. ✅ Sanitización de Emails (Prevención XSS)

**Problema Identificado:**
- Inputs de usuario insertados directamente en templates HTML de emails
- Riesgo de inyección XSS en emails
- Posible inyección de código malicioso

**Solución Implementada:**
- ✅ Función `escapeHtml()` para sanitizar todos los inputs
- ✅ Aplicada sanitización en 6 templates de email:
  - `msgPreRegistration` - Email de verificación
  - `msgRegistration` - Bienvenida
  - `msgPasswordRecovery` - Recuperación de contraseña
  - `msgPasswordReplaced` - Confirmación de cambio
  - `msgOrderNotificationToOfferer` - Notificación al vendedor
  - `msgOrderNotificationToBuyer` - Notificación al comprador
  - `secondMailToOfferer` - Mensaje secundario
  - `newsletterWelcome` - Bienvenida newsletter

**Archivos Modificados:**
- `backend/emailTemplates/mailMsg.js` - Añadida función `escapeHtml()` y aplicada a todas las funciones

**Función de Sanitización:**
```javascript
const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
```

**Antes (VULNERABLE):**
```javascript
html: `<p>Benvenuto ${username}</p>` // ❌ XSS vulnerable
```

**Después (SEGURO):**
```javascript
const safeUsername = escapeHtml(username);
html: `<p>Benvenuto ${safeUsername}</p>` // ✅ Protegido
```

---

## Configuración Requerida para Producción

### Variables de Entorno Obligatorias

```env
# Base de Datos
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Seguridad JWT (OBLIGATORIO)
JWT_SECRET=<generar con: openssl rand -base64 32>

# Blockchain
WEB3_INFURA_URL=wss://goerli.infura.io/ws/v3/YOUR_PROJECT_ID
WEB3_NETWORK_ID=5

# Email
SENDGRID_API_KEY=your-sendgrid-api-key

# Configuración del Servidor
PORT=5050
NODE_ENV=production
ALLOW_SEED=false
```

### Checklist de Seguridad Pre-Producción

- [ ] ✅ JWT_SECRET configurado con valor fuerte (mínimo 32 caracteres)
- [ ] ✅ NODE_ENV=production
- [ ] ✅ ALLOW_SEED=false o no configurado
- [ ] ✅ WEB3_INFURA_URL configurado con tu project ID
- [ ] ✅ SENDGRID_API_KEY configurado
- [ ] ✅ MONGODB_URL apunta a base de datos de producción
- [ ] ✅ Archivo .env NO incluido en el repositorio (verificar .gitignore)
- [ ] ✅ Ejecutar `npm audit` y corregir vulnerabilidades

---

## Vulnerabilidades Conocidas (Pendientes)

### Alta Prioridad
1. **Dependencias Desactualizadas:**
   - React 16.13 (actual: 18+)
   - Node 12.4 (EOL - End of Life)
   - Mongoose 5.10 (actual: 7+)
   - Multer con CVE-2022-24434
   - **Acción:** Actualizar dependencias críticas

2. **Sin Rate Limiting:**
   - Endpoints susceptibles a ataques de fuerza bruta
   - **Acción:** Implementar `express-rate-limit`

3. **Sin CORS Configurado:**
   - Puede permitir peticiones no autorizadas desde otros dominios
   - **Acción:** Configurar CORS apropiadamente

### Media Prioridad
1. **Sin HTTPS Forzado:**
   - **Acción:** Implementar redirección HTTP → HTTPS

2. **Sin Helmet.js:**
   - Headers de seguridad HTTP no configurados
   - **Acción:** Implementar helmet.js

3. **Console.log en Producción:**
   - 28+ instancias de console.log en backend
   - **Acción:** Reemplazar con logger apropiado (Winston/Pino)

4. **Sin Tests:**
   - Zero cobertura de tests
   - **Acción:** Implementar tests unitarios y de integración

---

## Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad en la plataforma Pagine Azzurre:

1. **NO** crear un issue público
2. Contactar directamente al mantenedor: g.lugo.dev@gmail.com
3. Incluir:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de mitigación (opcional)

---

## Historial de Cambios

### 2025-11-06 - Mejoras de Seguridad Mayores
- ✅ Implementadas 6 mejoras críticas de seguridad
- ✅ Protegidas claves API y secretos
- ✅ Añadida validación de inputs
- ✅ Filtrados datos sensibles
- ✅ Sanitizados templates de email
- ✅ Mejorada seguridad JWT
- ✅ Protegidos endpoints de seed

---

## Referencias y Recursos

### Mejores Prácticas de Seguridad
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Herramientas Recomendadas
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Auditoría de dependencias
- [Snyk](https://snyk.io/) - Seguridad de código y dependencias
- [OWASP ZAP](https://www.zaproxy.org/) - Testing de seguridad
- [Helmet.js](https://helmetjs.github.io/) - Headers HTTP seguros
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit) - Rate limiting

---

**Última Actualización:** 2025-11-06
**Versión:** 1.0.0
**Mantenedor:** Germán Lugo (g.lugo.dev@gmail.com)
