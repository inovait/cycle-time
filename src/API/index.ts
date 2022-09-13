/*
 * Copyright 2022, Inova IT d.o.o.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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
