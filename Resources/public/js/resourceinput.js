/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function () {
    'use strict';

    var manager = window.Claroline.ResourceManager;
    var common = window.Claroline.Common;
    var modal = window.Claroline.Modal;
    var translator = window.Translator;
    var routing =  window.Routing;
    var activePicker = null;
    var timeoutId = null;
    var defaultCallback = function (nodes) {
        var nodeId = _.keys(nodes)[0];
        var name = nodes[_.keys(nodes)][0];
        var type = nodes[_.keys(nodes)][1];
        $(activePicker).prev().val(nodeId);
        $(activePicker).prev().data('name', name);
        $(activePicker).prev().data('type', type);
        $(activePicker).prev().trigger('change');
        $('input', activePicker).val(name);
        checkView();
    };


    $(document).ready(function () {
        initialize();
        $('body').bind({
            'ajaxComplete': function () {
                initialize();
            },
            'DOMSubtreeModified': function () {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(initialize, 10);
            }
        });
    });

    /**
     * Initializes every resource input on the page.
     */
    function initialize() {
        $('input.resource-picker:not(.resource-picker-done)').each(function () {
            var pickerName = 'formResourcePicker';
            var customParameters = processCustomParameters($(this).data());

            var element = createInput(this.parentNode, pickerName, customParameters);
            var name = $(this).data('name');

            if (name) {
                $('.input-group input', element).val(name);
            }

            if ($(this).next().hasClass('help-block')) {
                $(this).next().appendTo(element);
            }

            $(this).addClass('resource-picker-done').addClass('hide');
            checkView($('.input-group', element));
        });
    };

    function processCustomParameters(datas) {
        var customParameters = null;

        var simpleParameterList = [
            'restrictForOwner',
            'isPickerMultiSelectAllowed',
            'isDirectorySelectionAllowed',
            'displayViewButton',
            'displayBrowseButton',
            'displayDownloadButton'
        ];
        var arrayParameterList = [
            'typeBlackList',
            'typeWhiteList'
        ];

        for (var i = 0; i < simpleParameterList.length; i++) {
            var simpleParameterName = simpleParameterList[i];
            if (undefined !== datas[simpleParameterName]) {
                customParameters = customParameters || {};
                customParameters[simpleParameterName] = datas[simpleParameterName];
            }
        }

        for (var i = 0; i < arrayParameterList.length; i++) {
            var arrayParameterName = arrayParameterList[i];
            if (undefined !== datas[arrayParameterName]) {
                customParameters = customParameters || {};
                customParameters[arrayParameterName] = datas[arrayParameterName].split(',');
            }
        }

        return customParameters;
    }

    /**
     * Creates a resource input as child of a dom element
     */
    function createInput(parentElement, pickerName, customParameters) {
        var displayViewButton     = (customParameters && undefined !== customParameters['displayViewButton']) ? customParameters['displayViewButton'] : true;
        var displayBrowseButton   = (customParameters && undefined !== customParameters['displayBrowseButton']) ? customParameters['displayBrowseButton'] : true;
        var displayDownloadButton = (customParameters && undefined !== customParameters['displayDownloadButton']) ? customParameters['displayDownloadButton'] : true;

        var buttonBar = common.createElement('span', 'input-group-btn');

        if (displayViewButton) {
            buttonBar.append(
                common.createElement('a', 'btn btn-default disabled resource-view')
                    .append(common.createElement('i', 'fa fa-eye'))
                    .attr('title', translator.trans('see', {}, 'platform'))
                    .attr('data-toggle', 'tooltip')
                    .attr('target', '_blank')
                    .css('margin', '0')
            );
        }

        if (displayBrowseButton) {
            buttonBar.append(
                common.createElement('a', 'btn btn-default')
                    .append(common.createElement('i', 'fa fa-folder-open'))
                    .attr('title', translator.trans('resources', {}, 'platform'))
                    .attr('data-toggle', 'tooltip')
                    .css('margin', '0')
                    .on('click', function () {
                        activePicker = this.parentNode.parentNode;
                        openPicker(pickerName, customParameters);
                    })
            );
        }

        if (displayDownloadButton) {
            buttonBar.append(
                common.createElement('a', 'btn btn-default')
                    .append(common.createElement('i', 'fa fa-file'))
                    .attr('title', translator.trans('upload', {}, 'platform'))
                    .attr('data-toggle', 'tooltip')
                    .css('margin', '0')
                    .on('click', function () {
                        activePicker = this.parentNode.parentNode;
                        modal.fromRoute('claro_upload_modal', null, function (element) {
                            element.on('click', '.resourcePicker', function () {
                                openPicker(pickerName, customParameters);
                            })
                                .on('click', '.filePicker', function () {
                                    $('#file_form_file').click();
                                })
                                .on('change', '#file_form_file', function () {
                                    common.uploadfile(this, element, defaultCallback);
                                });
                        });
                    })
            );
        }

        return $(parentElement).append(
            common.createElement('div', 'input-group')
                .append(
                    common.createElement('input', 'form-control')
                        .css('cursor', 'pointer')
                        .attr('type', 'text')
                        .attr('placeholder', translator.trans('add_resource', {}, 'platform'))
                        .on('focus', function () {
                            activePicker = this.parentNode;
                            openPicker(pickerName, customParameters);
                        })
                )
                .append(buttonBar)
        );
    }

    /**
     * Opens a resource picker.
     */
    function openPicker(pickerName, customParameters) {
        if (!manager.hasPicker(pickerName)) {
            var parameters = {
                callback: defaultCallback
            };

            if (customParameters) {
                _.keys(customParameters).forEach(function (parameter) {
                    parameters[parameter] = customParameters[parameter];
                });
            }

            manager.createPicker(pickerName, parameters, true);
        } else {
            manager.picker(pickerName, 'open');
        }
    };

    /**
     * Checks if a resource was selected and if so, enables the "view" button
     */
    function checkView(targetPicker) {
        activePicker = targetPicker || activePicker;

        var nodeId = $(activePicker).prev().val();
        var type = $(activePicker).prev().data('type');

        if (nodeId && type) {
            $('.resource-view', activePicker).removeClass('disabled').attr(
                'href',
                routing.generate('claro_resource_open', {
                    resourceType: type,
                    node: nodeId
                })
            );
        } else {
            $('.resource-view', activePicker).attr('href', '').addClass('disabled');
        }
    };
}());
