import createClient from 'openapi-fetch';
import type { components, paths } from './types.generated';

export type Patient = components['schemas']['Patient'];
export type Drug = components['schemas']['Drug'];
export type Pharmacy = components['schemas']['PharmacyDetails'];
export type Dosage = components['schemas']['Dosage'];

const fetcher = createClient<paths>({ baseUrl: "https://services.careconnect.dev.wellsync.io" });

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

    if (!data?.patient) throw new Error(error?.message ?? 'Patient not found');

    return data?.patient as Patient;
};

export const getDrugs = async (patientExternalId: string) => {
    const { data } = await fetcher.GET('/v1/drugs', {
        params: {
            query: {
                patientExternalId,
            }
        }
    });

    return data?.drugs as Drug[];
};

export const getPharmacy = async (patientExternalId: string, drugId: string) => {
    const { data } = await fetcher.GET('/v1/pharmacies', {
        params: {
            query: {
                patientExternalId,
                drugId,
            }
        }
    });

    return data?.pharmacy;
};
