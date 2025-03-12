import createClient from 'openapi-fetch';
import type { components, paths } from './types.generated';

export type Patient = components['schemas']['Patient'];
export type Drug = components['schemas']['Drug'];
export type Pharmacy = components['schemas']['PharmacyContactInfo'];
export type Dosage = components['schemas']['Dosage'];
export type Clinic = components['schemas']['Clinic'];

const params = new URLSearchParams(window.location.search);

const environments = {
    dev: 'https://services.careconnect.dev.wellsync.io',
    stg: 'https://services.careconnect.stg.wellsync.io',
    prd: 'https://services.careconnect.prd.wellsync.io',
};

const param = (params.get("environment") as 'dev' | 'stg' | 'prd') || "prd";
const environment = environments[param] || environments.prd;

const fetcher = createClient<paths>({ baseUrl: environment });

fetcher.use({
    onRequest: async ({ request }) => {
        request.headers.set('Authorization', 'Bearer super-secret-key');
        return request;
    },
});

export const getPatient = async (externalId: string) => {
    const { data, error } = await fetcher.GET('/v1/patients', {
        params: {
            query: {
                externalId,
            }
        }
    });

    if (!data?.patients) throw new Error(error?.message ?? 'Patient not found');

    return data?.patients[0] as Patient;
};

export const getClinic = async (externalId: string) => {
    const { data, error } = await fetcher.GET('/v1/clinics', {
        params: {
            query: {
                externalId,
            }
        }
    });

    if (!data?.clinics) throw new Error(error?.message ?? 'Clinic not found');

    return data?.clinics[0] as Patient;
};

export const getDrugs = async (patientId: string) => {
    const { data } = await fetcher.GET('/v1/patients/{patientId}/drugs', {
        params: {
            path: {
                patientId,
            }
        }
    });

    return data?.drugs as Drug[];
};

export const getPharmacy = async (clinicId: string, patientId: string, drugId: string) => {
    const { data } = await fetcher.GET('/v1/clinics/{clinicId}/patients/{patientId}/pharmacy', {
        params: {
            path: {
                clinicId,
                patientId,
            },
            query: {
                drugId,
            }
        }
    });

    return data?.pharmacy;
};
