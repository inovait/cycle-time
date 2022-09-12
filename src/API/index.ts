// const fetch = require('node-fetch');
import fetch from 'node-fetch';

export const fetchTicketsForProject = async (email: string, token: string, domain: string, startAt: number, maxResults: number, JQL: string) => {
    const res = await fetch(`https://${domain}/rest/api/3/search?startAt=${startAt}&maxResults=${maxResults}&jql=${JQL}&expand=changelog`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
            'Accept': 'application/json'
        },
    });

    const resJson = await res.json();

    if (res.ok) {
        return resJson;
    }

    if (resJson.errorMessages) {
        const allErrorMessages = resJson.errorMessages.join('\n');

        throw new Error(allErrorMessages);
    }

    throw new Error('Something went wrong :(.');
};

export const fetchStatusesForProject = async (email: string, token: string, domain: string, project: string) => {
    const res = await fetch(`https://${domain}/rest/api/3/project/${project}/statuses`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
            'Accept': 'application/json'
        },
    });

    const resJson = await res.json();

    if (res.ok) {
        return resJson;
    }

    if (resJson.errorMessages) {
        const allErrorMessages = resJson.errorMessages.join('\n');

        throw new Error(allErrorMessages);
    }

    throw new Error('Something went wrong :(.');
};
