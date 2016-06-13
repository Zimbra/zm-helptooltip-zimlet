/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 5/11/11
 * Time: 11:36 PM
 * To change this template use File | Settings | File Templates.
 */


ZaHelpTooltip = function() {

}

ZaHelpTooltip.prototype = new ZaItem();
ZaHelpTooltip.prototype.constructor = ZaHelpTooltip;

ZaHelpTooltip.A_description = "description";

ZaHelpTooltip.descriptionCache = {};
ZaHelpTooltip.cacheNumber = 0;
ZaHelpTooltip.getDescByName = function(name) {
    if(ZaHelpTooltip.descriptionCache[name] !== undefined){
        return ZaHelpTooltip.descriptionCache[name];
    }

    if(ZaHelpTooltip.cacheNumber > 50) {
        ZaHelpTooltip.descriptionCache = {};
    }

    ZaHelpTooltip.descriptionCache[name] =  ZaHelpTooltip.getDescBySoap(name);
    return ZaHelpTooltip.descriptionCache[name];
}

ZaHelpTooltip.getDescBySoap =
function(name) {
    var soapDoc = AjxSoapDoc.create("GetAttributeInfoRequest", ZaZimbraAdmin.URN, null);
    var el = soapDoc.setMethodAttribute("attrs", name);
    var params = new Object();
    params.soapDoc = soapDoc;
    var reqMgrParams = {
			controller: ZaApp.getInstance().getCurrentController(),
			busyMsg: ZaMsg.BUSY_GET_DESC
    };
    var resp = ZaRequestMgr.invoke(params, reqMgrParams).Body.GetAttributeInfoResponse;
    var obj = "";
    if(resp && resp.a && resp.a[0]) {
        obj = resp.a[0].desc;
    }
    return obj;
}