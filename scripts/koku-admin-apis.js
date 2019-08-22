// Description:
//	Interact with the Koku Admin APIs
//
// Configuration:
//	HUBOT_HCCM_ADMIN_API_PROTOCOL
//	HUBOT_HCCM_ADMIN_API_HOST
//	HUBOT_HCCM_ADMIN_API_PORT
//	HUBOT_HCCM_ADMIN_API_PREFIX
//
// Commands:
//  hubot trigger-download - Trigger cloud provider data processing
//  hubot cost-model-update <account> <provider_uuid> - Update the derived cost calculation for the account
//  hubot summarize-all <start_date> <end_date> - Run report summarization for all accounts
//  hubot summarize-provider <account> <provider_uuid> <provider_type> <start_date> <end_date> - Run report summarization for a provider
//
// Author:
//	chambridge@redhat.com
//
'use strict';

const axios = require('axios');

const DOWNLOAD_REGEX = /(trigger-download)/i;
const DOWNLOAD_ID = 'hubot.trigger-download';
const COST_MODEL_UPDATE_REGEX = /cost-model-update\s+(\S+)\s+(\S+)$/i;
const COST_MODEL_UPDATE_ID = 'hubot.cost-model-update';
const SUMMARIZE_ALL_REGEX = /summarize-all\s+(\S+)\s+(\S+)$/i
const SUMMARIZE_ALL_ID = 'hubot.summarize-all';
const SUMMARIZE_PROVIDER_REGEX = /summarize-provider\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)$/i;
const SUMMARIZE_PROVIDER_ID = 'hubot.summarize-provider';

const path = require('path');
const TAG = path.basename(__filename);

const API_PROTOCOL = process.env.HUBOT_HCCM_ADMIN_API_PROTOCOL || 'http'
const API_HOST = process.env.HUBOT_HCCM_ADMIN_API_HOST || 'localhost'
const API_PORT = process.env.HUBOT_HCCM_ADMIN_API_PORT || '8080'
const API_PREFIX = process.env.HUBOT_HCCM_ADMIN_API_PREFIX || 'api/cost-management/v1'
const API_ENDPOINT = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/${API_PREFIX}`
const CHANNEL_WHITELIST = process.env.HUBOT_WHITELIST
module.exports = robot => {

    robot.receiveMiddleware(function (context, next, done) {
        if (typeof CHANNEL_WHITELIST === 'undefined') {
            next(done)
        } else {
            let whitelist = CHANNEL_WHITELIST.split(',')
            try {
                let room = context.response.envelope.room
                if (whitelist.includes(room)) {
                    next(done)
                } else {
                    context.response.reply(`Sorry, I don't work in this channel: ${room}`)
                    robot.logger.debug(`Invalid room ${room}`);
                    context.response.message.finish()
                    done();
                }
            } catch (error) {
                robot.logger.debug(error);
            }
        }
    });

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

    robot.respond(SUMMARIZE_ALL_REGEX, { id: SUMMARIZE_ALL_ID }, (res) => {
      robot.logger.debug(`${TAG}: ${SUMMARIZE_ALL_ID}`);
      let start_date = res.match[1]
      let end_date = res.match[2]
      axios.get(`${API_ENDPOINT}/report_data/?provider_uuid=*&start_date=${start_date}&end_date=${end_date}`)
        .then(response => {
          robot.logger.debug(response.data.url);
          let output = `Summarizing all providers from ${start_date} to ${end_date}!`
          res.reply(output);
          res.reply(JSON.stringify(response.data))
        })
        .catch(error => {
          robot.logger.debug(error);
          let output = `Something went wrong. Error ${error}`
          res.reply(output);
        });
    });

    robot.respond(SUMMARIZE_PROVIDER_REGEX, { id: SUMMARIZE_PROVIDER_ID }, (res) => {
      robot.logger.debug(`${TAG}: ${SUMMARIZE_PROVIDER_ID}`);
      let account = `acct${res.match[1]}`
      let provider_uuid = res.match[2]
      let provider_type = res.match[3]
      let start_date = res.match[4]
      let end_date = res.match[5]
      axios.get(`${API_ENDPOINT}/report_data/?schema=${account}&provider_uuid=${provider_uuid}&provider_type=${provider_type}&start_date=${start_date}&end_date=${end_date}`)
        .then(response => {
          robot.logger.debug(response.data.url);
          let output = `Summarizing all providers from ${start_date} to ${end_date}!`
          res.reply(output);
          res.reply(JSON.stringify(response.data))
        })
        .catch(error => {
          robot.logger.debug(error);
          let output = `Something went wrong. Error ${error}`
          res.reply(output);
        });
    });

    robot.respond(COST_MODEL_UPDATE_REGEX, { id: COST_MODEL_UPDATE_ID }, (res) => {
        robot.logger.debug(`${TAG}: ${COST_MODEL_UPDATE_ID}`);
        let account = `acct${res.match[1]}`
        let provider_uuid = res.match[2]
        axios.get(`${API_ENDPOINT}/update_charge/?schema=${account}&provider_uuid=${provider_uuid}`)
            .then(response => {
            robot.logger.debug(response.data.url);
            let output = 'Updating with cost model!'
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
