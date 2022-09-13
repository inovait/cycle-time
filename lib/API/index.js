"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStatusesForProject = exports.fetchTicketsForProject = void 0;
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
const node_fetch_1 = __importDefault(require("node-fetch"));
const fetchTicketsForProject = (email, token, domain, startAt, maxResults, JQL) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, node_fetch_1.default)(`https://${domain}/rest/api/3/search?startAt=${startAt}&maxResults=${maxResults}&jql=${JQL}&expand=changelog`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
            'Accept': 'application/json'
        },
    });
    const resJson = yield res.json();
    if (res.ok) {
        return resJson;
    }
    if (resJson.errorMessages) {
        const allErrorMessages = resJson.errorMessages.join('\n');
        throw new Error(allErrorMessages);
    }
    throw new Error('Something went wrong :(.');
});
exports.fetchTicketsForProject = fetchTicketsForProject;
const fetchStatusesForProject = (email, token, domain, project) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, node_fetch_1.default)(`https://${domain}/rest/api/3/project/${project}/statuses`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
            'Accept': 'application/json'
        },
    });
    const resJson = yield res.json();
    if (res.ok) {
        return resJson;
    }
    if (resJson.errorMessages) {
        const allErrorMessages = resJson.errorMessages.join('\n');
        throw new Error(allErrorMessages);
    }
    throw new Error('Something went wrong :(.');
});
exports.fetchStatusesForProject = fetchStatusesForProject;
