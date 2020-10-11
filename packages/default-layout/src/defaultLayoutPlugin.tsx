/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { attachmentPlugin } from '@react-pdf-viewer/attachment';
import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import { Plugin, PluginFunctions, PluginOnDocumentLoad, RenderViewer, ViewerState, PluginOnTextLayerRender } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { toolbarPlugin, ToolbarPluginProps } from '@react-pdf-viewer/toolbar';

import Sidebar from './Sidebar';

export interface DefaultLayoutPluginProps {
    toolbarPlugin?: ToolbarPluginProps;
}

const defaultLayoutPlugin = (props?: DefaultLayoutPluginProps): Plugin => {
    const attachmentPluginInstance = attachmentPlugin();
    const bookmarkPluginInstance = bookmarkPlugin();
    const thumbnailPluginInstance = thumbnailPlugin();
    const toolbarPluginInstance = toolbarPlugin(props ? props.toolbarPlugin : {});

    const { Attachments } = attachmentPluginInstance;
    const { Bookmarks } = bookmarkPluginInstance;
    const { Thumbnails } = thumbnailPluginInstance;
    const { Toolbar } = toolbarPluginInstance;

    const plugins = [
        attachmentPluginInstance,
        bookmarkPluginInstance,
        thumbnailPluginInstance,
        toolbarPluginInstance,
    ];

    return {
        install: (pluginFunctions: PluginFunctions) => {
            // Install plugins
            plugins.forEach(plugin => {
                if (plugin.install) {
                    plugin.install(pluginFunctions);
                }
            });
        },
        renderViewer: (props: RenderViewer) => {
            let { slot } = props;
            plugins.forEach(plugin => {
                if (plugin.renderViewer) {
                    slot = plugin.renderViewer({...props, slot});
                }
            });

            slot.children = (
                <div className='rpv-default-layout-container'>
                    <div className='rpv-default-layout-toolbar'>
                        <Toolbar />
                    </div>
                    <div className='rpv-default-layout-main'>
                        <Sidebar
                            tabContents={[
                                () => <Thumbnails />,
                                () => <Bookmarks />,
                                () => <Attachments />,
                            ]}
                        />
                        <div
                            className='rpv-default-layout-body'
                            ref={slot.subSlot.attrs.ref}
                            style={slot.subSlot.attrs.style}
                        >
                            {slot.subSlot.children}
                        </div>
                    </div>
                </div>
            );
            
            slot.subSlot.attrs = {};
            slot.subSlot.children = <></>;

            return slot;
        },
        uninstall: (pluginFunctions: PluginFunctions) => {
            // Unistall plugins
            plugins.forEach(plugin => {
                if (plugin.uninstall) {
                    plugin.uninstall(pluginFunctions);
                }
            });
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            plugins.forEach(plugin => {
                if (plugin.onDocumentLoad) {
                    plugin.onDocumentLoad(props);
                }
            });
        },
        onTextLayerRender: (props: PluginOnTextLayerRender) => {
            plugins.forEach(plugin => {
                if (plugin.onTextLayerRender) {
                    plugin.onTextLayerRender(props);
                }
            });
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            let newState = viewerState;
            plugins.forEach(plugin => {
                if (plugin.onViewerStateChange) {
                    newState = plugin.onViewerStateChange(newState);
                }
            });
            return newState;
        },
    };
};

export default defaultLayoutPlugin;
