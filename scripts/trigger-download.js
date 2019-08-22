// Description:
//	Trigger cloud provider data processing
//
// Configuration:
//	HUBOT_HCCM_ADMIN_API_PROTOCOL
//	HUBOT_HCCM_ADMIN_API_HOST
//	HUBOT_HCCM_ADMIN_API_PORT
//	HUBOT_HCCM_ADMIN_API_PREFIX
//
// Commands:
//  hubot trigger-download - Trigger cloud provider data processing
//
// Author:
//	chambridge@redhat.com
//
'use strict';

const axios = require('axios');

const DOWNLOAD_REGEX = /(trigger-download)/i;
const DOWNLOAD_ID = 'hubot.trigger-download';

const path = require('path');
const TAG = path.basename(__filename);

const API_PROTOCOL = process.env.HUBOT_HCCM_ADMIN_API_PROTOCOL || 'http'
const API_HOST = process.env.HUBOT_HCCM_ADMIN_API_HOST || 'localhost'
const API_PORT = process.env.HUBOT_HCCM_ADMIN_API_PORT || '8080'
const API_PREFIX = process.env.HUBOT_HCCM_ADMIN_API_PREFIX || 'api/cost-management/v1'
const API_ENDPOINT = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/${API_PREFIX}`
module.exports = robot => {

    robot.respond(DOWNLOAD_REGEX, { id: DOWNLOAD_ID }, (res) => {
        robot.logger.debug(`${TAG}: ${DOWNLOAD_ID}`);
        axios.get(`${API_ENDPOINT}/download/`)
            .then(response => {
                robot.logger.debug(response.data.url);
                let output = 'Triggering download!'
                res.reply(output);
                res.reply(JSON.stringify(response.data))
            })
            .catch(error => {
                robot.logger.debug(error);
                let output = `Something went wrong. Error ${error}`
                res.reply(output);
            });
    });
};
