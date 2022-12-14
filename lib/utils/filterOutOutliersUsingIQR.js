"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateIQRWithLowerAndUpperLimit = void 0;
const compute_quantile_1 = __importDefault(require("compute-quantile"));
const calculateIQRWithLowerAndUpperLimit = (items) => {
    const sortedItems = items.sort((a, b) => a - b);
    const q1 = (0, compute_quantile_1.default)(sortedItems, 0.25);
    const q3 = (0, compute_quantile_1.default)(sortedItems, 0.75);
    const IQR = q3 - q1;
    const lowerLimit = q1 - 1.5 * IQR;
    const upperLimit = q3 + 1.5 * IQR;
    return { IQR, upperLimit, lowerLimit, q1, q3 };
};
exports.calculateIQRWithLowerAndUpperLimit = calculateIQRWithLowerAndUpperLimit;
const filterOutOutliersUsingIQR = (items) => {
    const issueTimeArray = items.map(({ time }) => time).filter((time) => time);
    const { IQR, lowerLimit, upperLimit, q1, q3 } = (0, exports.calculateIQRWithLowerAndUpperLimit)(issueTimeArray);
    const outliers = items.filter(({ time }) => time < lowerLimit || time > upperLimit);
    const withoutOutliers = items.filter(({ time }) => time >= lowerLimit && time <= upperLimit);
    return { upperLimit, lowerLimit, withoutOutliers, outliers, IQR, q1, q3 };
};
exports.default = filterOutOutliersUsingIQR;
