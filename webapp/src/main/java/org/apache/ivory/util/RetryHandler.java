/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.ivory.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.jms.TextMessage;

import org.apache.ivory.IvoryException;
import org.apache.ivory.aspect.instances.IvoryTopicSubscriber;
import org.apache.ivory.entity.v0.EntityType;
import org.apache.ivory.entity.v0.process.Process;
import org.apache.ivory.resource.ProcessInstanceManager;
import org.apache.ivory.resource.ProcessInstancesResult;
import org.apache.ivory.resource.ProcessInstancesResult.WorkflowStatus;
import org.apache.ivory.workflow.engine.WorkflowEngine;
import org.apache.log4j.Logger;

public class RetryHandler {

	private static final Logger LOG = Logger.getLogger(RetryHandler.class);

	// TODO handle different retry options, currently immediate retry
	public static void retry(String processName, String nominalTime,
			String runId, TextMessage textMessage, String wfId,
			WorkflowEngine workflowEngine) throws IvoryException {

		try {
			ProcessInstanceManager instanceManager = new ProcessInstanceManager();
			Process processObj = (Process) instanceManager.getEntityObject(
					processName, EntityType.PROCESS.name());
			int attempts = processObj.getRetry().getAttempts();
			int intRunId = Integer.parseInt(runId);
			String ivoryDate = getIvoryDate(nominalTime);
			ProcessInstancesResult statusResult = new ProcessInstanceManager()
					.getStatus(processName, ivoryDate, null);
			WorkflowStatus status;
			if (statusResult.getInstances() != null) {
				status = statusResult.getInstances()[0].status;
				if (status.equals(WorkflowStatus.RUNNING)) {
					LOG.info("Re-enqueing message:" + processName + ":"
							+ ivoryDate);
					IvoryTopicSubscriber.sendMessage(textMessage);
					return;
				}
			}
			if (attempts > intRunId) {
				LOG.info("Retrying attempt" + (intRunId + 1)
						+ " out of configured: " + attempts
						+ " attempt for process instance::" + processName + ":"
						+ nominalTime + " And WorkflowId: " + wfId);

				workflowEngine.reRun(processObj.getCluster().getName(), wfId,
						null);
			}
		} catch (Exception e) {
			LOG.error(e);
			throw new IvoryException(e);
		}
	}

	public static String getIvoryDate(String nominalTime) throws ParseException {
		DateFormat nominalFormat = new SimpleDateFormat(
				"yyyy'-'MM'-'dd'-'HH'-'mm");
		Date nominalDate = nominalFormat.parse(nominalTime);
		DateFormat ivoryFormat = new SimpleDateFormat(
				"yyyy'-'MM'-'dd'T'HH':'mm'Z'");
		return ivoryFormat.format(nominalDate);

	}

}