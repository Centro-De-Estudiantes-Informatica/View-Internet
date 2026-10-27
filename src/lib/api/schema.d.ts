export interface paths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["HealthController_check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Iniciar sesión con cédula y contraseña */
        post: operations["AuthController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/change-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cambiar la contraseña; emite un token nuevo e invalida los anteriores */
        post: operations["AuthController_changePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Perfil de la persona autenticada */
        get: operations["AuthController_me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Cuota del periodo actual en USD, VES y COP con la tasa usada */
        get: operations["BillingController_current"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/fee": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Cambiar la cuota mensual (aplica a los periodos que se abran después) */
        put: operations["BillingController_setFee"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/rates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Historial de tasas, de la más reciente a la más antigua */
        get: operations["BillingController_listRates"];
        put?: never;
        /** Registrar (o corregir) la tasa de un día */
        post: operations["BillingController_setRate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listado paginado con búsqueda y estado del periodo */
        get: operations["UsersController_list"];
        put?: never;
        /** Crear persona con contraseña temporal */
        post: operations["UsersController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["UsersController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Editar nombre/teléfono o activar/desactivar la cuenta */
        patch: operations["UsersController_update"];
        trace?: never;
    };
    "/users/{id}/role": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Cambiar el rol (no el propio; siempre queda un administrador) */
        patch: operations["UsersController_changeRole"];
        trace?: never;
    };
    "/users/{id}/reset-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Restablecer contraseña; invalida las sesiones de esa persona */
        post: operations["UsersController_resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listado de pagos (la cola de revisión es status=EN_REVISION) */
        get: operations["PaymentsController_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/cash": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Registrar pago en efectivo (queda APROBADO) */
        post: operations["PaymentsController_registerCash"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Aprobar un pago EN_REVISION */
        post: operations["PaymentsController_approve"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/{id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Rechazar un pago EN_REVISION con motivo (lo ve el estudiante) */
        post: operations["PaymentsController_reject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/{id}/void": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Anular un pago APROBADO con motivo (los pagos nunca se borran) */
        post: operations["PaymentsController_void"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/{id}/receipt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** URL firmada (5 min) de la captura del pago móvil */
        get: operations["PaymentsController_receipt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Mi estado del periodo actual, periodos adeudados y monto pendiente */
        get: operations["MePaymentsController_myStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Mi historial de pagos, incluidos los rechazados con su motivo */
        get: operations["MePaymentsController_myPayments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/payments/mobile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reportar un pago móvil en VES (queda EN_REVISION) */
        post: operations["MePaymentsController_reportMobile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/metrics/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Resumen del periodo para el dashboard */
        get: operations["MetricsController_summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/metrics/monthly": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Serie mensual de recaudado en USD (meses sin pagos en 0) */
        get: operations["MetricsController_monthly"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/metrics/recent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Últimos pagos aprobados */
        get: operations["MetricsController_recent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        LoginDto: {
            /**
             * @description Con o sin puntos, guiones ni prefijo
             * @example V-28.123.456
             */
            cedula: string;
            password: string;
        };
        ProfileDto: {
            id: string;
            /** @example V-28.123.456 */
            cedula: string;
            fullName: string;
            phone?: string | null;
            /** @enum {string} */
            role: "ESTUDIANTE" | "ADMIN";
            active: boolean;
            mustChangePassword: boolean;
            /** Format: date-time */
            createdAt: string;
        };
        SessionDto: {
            accessToken: string;
            /** @example Bearer */
            tokenType: string;
            /** @description Segundos de validez del token */
            expiresIn: number;
            /** @enum {string} */
            role: "ESTUDIANTE" | "ADMIN";
            mustChangePassword: boolean;
            user: components["schemas"]["ProfileDto"];
        };
        ChangePasswordDto: {
            currentPassword: string;
            newPassword: string;
        };
        FeeByCurrencyDto: {
            /** @example 5.00 */
            USD: string;
            /** @example 1000.00 */
            VES: string | null;
            /** @example 20000.00 */
            COP: string | null;
        };
        CurrentRateDto: {
            /** @example 200.0000 */
            ratePerUsd: string;
            /** @example 2026-10-26 */
            effectiveDate: string;
            /** @description true si la tasa tiene más de 1 día */
            stale: boolean;
        };
        RatesByCurrencyDto: {
            VES: components["schemas"]["CurrentRateDto"] | null;
            COP: components["schemas"]["CurrentRateDto"] | null;
        };
        BillingCurrentDto: {
            /** @example 2026-10 */
            periodo: string;
            /** @example 5.00 */
            feeUsd: string;
            fee: components["schemas"]["FeeByCurrencyDto"];
            rates: components["schemas"]["RatesByCurrencyDto"];
        };
        SetFeeDto: {
            /**
             * @description Cuota mensual en USD
             * @example 5.00
             */
            feeUsd: string;
        };
        FeeDto: {
            /**
             * @description Cuota vigente para los periodos que se abran
             * @example 6.00
             */
            feeUsd: string;
            /** @example 2026-10 */
            currentPeriod: string;
            /**
             * @description Cuota congelada del periodo actual
             * @example 5.00
             */
            currentPeriodFeeUsd: string;
        };
        SetRateDto: {
            /** @enum {string} */
            currency: "VES" | "COP";
            /**
             * @description Unidades de la moneda por 1 USD
             * @example 200.00
             */
            ratePerUsd: string;
            /**
             * @description Por defecto, hoy
             * @example 2026-10-26
             */
            effectiveDate?: string;
        };
        RateDto: {
            id: string;
            /** @enum {string} */
            currency: "VES" | "COP";
            /** @example 200.0000 */
            ratePerUsd: string;
            /** @example 2026-10-26 */
            effectiveDate: string;
            /** Format: date-time */
            createdAt: string;
        };
        Object: Record<string, never>;
        CreateUserDto: {
            /** @example V-30.555.111 */
            cedula: string;
            /** @example José Rodríguez */
            fullName: string;
            /** @example 04141234567 */
            phone?: string;
            /**
             * @default ESTUDIANTE
             * @enum {string}
             */
            role: "ESTUDIANTE" | "ADMIN";
        };
        CreatedUserDto: {
            user: components["schemas"]["ProfileDto"];
            /** @description Se muestra una sola vez */
            temporaryPassword: string;
        };
        UserPeriodDto: {
            /** @example 2026-10 */
            periodo: string;
            /** @enum {string} */
            status: "AL_DIA" | "PARCIAL" | "EN_REVISION" | "PENDIENTE";
            /** @example 3.00 */
            paidUsd: string;
            /** @example 5.00 */
            feeUsd: string;
        };
        UserListItemDto: {
            id: string;
            /** @example V-28.123.456 */
            cedula: string;
            fullName: string;
            phone?: string | null;
            /** @enum {string} */
            role: "ESTUDIANTE" | "ADMIN";
            active: boolean;
            mustChangePassword: boolean;
            /** Format: date-time */
            createdAt: string;
            /** @description null si no hay cuota configurada */
            period: components["schemas"]["UserPeriodDto"] | null;
        };
        UserPageDto: {
            items: components["schemas"]["UserListItemDto"][];
            total: number;
            page: number;
            pageSize: number;
        };
        UpdateUserDto: {
            fullName?: string;
            /** @description null para borrarlo */
            phone?: string | null;
            active?: boolean;
        };
        ChangeRoleDto: {
            /** @enum {string} */
            role: "ESTUDIANTE" | "ADMIN";
        };
        TemporaryPasswordDto: {
            /** @description Se muestra una sola vez */
            temporaryPassword: string;
        };
        PaymentUserDto: {
            id: string;
            /** @example V-28.123.456 */
            cedula: string;
            fullName: string;
        };
        PaymentDto: {
            id: string;
            user: components["schemas"]["PaymentUserDto"];
            /** @example 2026-10 */
            periodo: string;
            /** @enum {string} */
            method: "EFECTIVO" | "PAGO_MOVIL";
            /** @enum {string} */
            currency: "USD" | "VES" | "COP";
            /** @example 1000.00 */
            amount: string;
            /** @example 200.0000 */
            rate: string;
            /** @example 2026-10-26 */
            rateDate: string | null;
            /** @example 5.00 */
            amountUsd: string;
            /** @enum {string} */
            status: "EN_REVISION" | "APROBADO" | "RECHAZADO" | "ANULADO";
            reference: string | null;
            bank: string | null;
            payerPhone: string | null;
            /** @example 2026-10-26 */
            paidAt: string;
            hasReceipt: boolean;
            note: string | null;
            registeredBy: string | null;
            reviewedBy: string | null;
            /** Format: date-time */
            reviewedAt: string | null;
            /** @description Motivo de rechazo o nota de aprobación */
            reviewNote: string | null;
            voidedBy: string | null;
            /** Format: date-time */
            voidedAt: string | null;
            voidReason: string | null;
            /** Format: date-time */
            createdAt: string;
        };
        PaymentPageDto: {
            items: components["schemas"]["PaymentDto"][];
            total: number;
            page: number;
            pageSize: number;
        };
        CashPaymentDto: {
            /** Format: uuid */
            userId: string;
            /** @example 2026-10 */
            periodo: string;
            /** @enum {string} */
            currency: "USD" | "VES" | "COP";
            /** @example 5.00 */
            amount: string;
            /**
             * @description Por defecto, hoy
             * @example 2026-10-26
             */
            paidAt?: string;
            note?: string;
        };
        ApproveDto: {
            note?: string;
        };
        ReasonDto: {
            /** @example La referencia no aparece en el banco */
            reason: string;
        };
        ReceiptUrlDto: {
            url: string;
            /** @example 300 */
            expiresIn: number;
        };
        PeriodBalanceDto: {
            /** @example 2026-10 */
            periodo: string;
            /** @enum {string} */
            status: "AL_DIA" | "PARCIAL" | "EN_REVISION" | "PENDIENTE";
            /** @example 5.00 */
            feeUsd: string;
            /** @example 3.00 */
            paidUsd: string;
            /** @example 2.00 */
            balanceUsd: string;
            inReviewCount: number;
        };
        AmountByCurrencyDto: {
            /** @example 2.00 */
            USD: string;
            /** @example 400.00 */
            VES: string | null;
            /** @example 8000.00 */
            COP: string | null;
        };
        MyStatusDto: {
            current: components["schemas"]["PeriodBalanceDto"];
            /** @description Periodos no saldados, del más antiguo al más reciente */
            owedPeriods: components["schemas"]["PeriodBalanceDto"][];
            /** @description Total pendiente a las tasas vigentes */
            pending: components["schemas"]["AmountByCurrencyDto"];
        };
        MobilePaymentFormDto: {
            /**
             * @description Número de referencia del pago móvil
             * @example 004512
             */
            reference: string;
            /**
             * @description Código del banco de origen (4 dígitos)
             * @example 0134
             */
            bank: string;
            /** @example 04141234567 */
            payerPhone: string;
            /** @example 2026-10-26 */
            paidAt: string;
            /** @example 1000.00 */
            amount: string;
            /**
             * @description Solo VES
             * @default VES
             * @enum {string}
             */
            currency: "USD" | "VES" | "COP";
            /**
             * @description Por defecto, el periodo actual
             * @example 2026-10
             */
            periodo?: string;
            /**
             * Format: binary
             * @description JPG o PNG, máx. 5 MB
             */
            receipt?: string;
        };
        CollectedDto: {
            /**
             * @description Monto en la moneda original
             * @example 1000.00
             */
            amount: string;
            /** @example 5.00 */
            amountUsd: string;
            count: number;
        };
        CollectedByCurrencyDto: {
            USD: components["schemas"]["CollectedDto"];
            VES: components["schemas"]["CollectedDto"];
            COP: components["schemas"]["CollectedDto"];
        };
        StudentsByStatusDto: {
            /** @description Estudiantes activos considerados en el periodo */
            total: number;
            AL_DIA: number;
            PARCIAL: number;
            EN_REVISION: number;
            PENDIENTE: number;
        };
        InReviewDto: {
            /** @description Pagos EN_REVISION del periodo */
            period: number;
            /** @description Pagos EN_REVISION de todos los periodos (cola de revisión) */
            total: number;
        };
        SummaryDto: {
            /** @example 2026-10 */
            periodo: string;
            /** @example 5.00 */
            feeUsd: string;
            collected: components["schemas"]["CollectedByCurrencyDto"];
            /** @example 120.00 */
            totalUsd: string;
            /**
             * @description Estudiantes activos × cuota
             * @example 200.00
             */
            expectedUsd: string;
            /**
             * @description Porcentaje cobrado (0–100+)
             * @example 60.00
             */
            percentCollected: string;
            students: components["schemas"]["StudentsByStatusDto"];
            inReview: components["schemas"]["InReviewDto"];
        };
        MonthlyPointDto: {
            /** @example 2026-10 */
            periodo: string;
            /** @example 120.00 */
            totalUsd: string;
        };
        RecentPaymentDto: {
            id: string;
            user: components["schemas"]["PaymentUserDto"];
            /** @enum {string} */
            method: "EFECTIVO" | "PAGO_MOVIL";
            /** @enum {string} */
            currency: "USD" | "VES" | "COP";
            /** @example 1000.00 */
            amount: string;
            /** @example 5.00 */
            amountUsd: string;
            /** @example 2026-10 */
            periodo: string;
            /** @example 2026-10-26 */
            paidAt: string;
            /**
             * Format: date-time
             * @description Momento en que quedó aprobado
             */
            approvedAt: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    HealthController_check: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionDto"];
                };
            };
        };
    };
    AuthController_changePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionDto"];
                };
            };
        };
    };
    AuthController_me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileDto"];
                };
            };
        };
    };
    BillingController_current: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BillingCurrentDto"];
                };
            };
        };
    };
    BillingController_setFee: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetFeeDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    BillingController_listRates: {
        parameters: {
            query?: {
                currency?: "VES" | "COP";
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RateDto"][];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    BillingController_setRate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetRateDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RateDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_list: {
        parameters: {
            query?: {
                /** @description Cédula (3+ dígitos) o nombre, sin importar acentos */
                q?: string;
                role?: "ESTUDIANTE" | "ADMIN";
                estado?: "AL_DIA" | "PARCIAL" | "EN_REVISION" | "PENDIENTE";
                /** @description Por defecto, el periodo actual */
                periodo?: string;
                active?: boolean;
                page?: number;
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserPageDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUserDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreatedUserDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_changeRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangeRoleDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TemporaryPasswordDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_list: {
        parameters: {
            query?: {
                status?: "EN_REVISION" | "APROBADO" | "RECHAZADO" | "ANULADO";
                periodo?: string;
                userId?: string;
                method?: "EFECTIVO" | "PAGO_MOVIL";
                currency?: "USD" | "VES" | "COP";
                page?: number;
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentPageDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_registerCash: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CashPaymentDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_approve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApproveDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_reject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReasonDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_void: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReasonDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_receipt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReceiptUrlDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MePaymentsController_myStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyStatusDto"];
                };
            };
        };
    };
    MePaymentsController_myPayments: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDto"][];
                };
            };
        };
    };
    MePaymentsController_reportMobile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["MobilePaymentFormDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDto"];
                };
            };
            /** @description Requiere rol ESTUDIANTE */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MetricsController_summary: {
        parameters: {
            query?: {
                /** @description Por defecto, el periodo actual */
                periodo?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SummaryDto"];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MetricsController_monthly: {
        parameters: {
            query?: {
                months?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MonthlyPointDto"][];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MetricsController_recent: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecentPaymentDto"][];
                };
            };
            /** @description Requiere rol ADMIN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
