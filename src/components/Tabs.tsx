import { State } from "@meeco/sdk";

import React from 'react'
import * as state from '../state'
import classNames from 'classnames';

interface TabsProps {
    currentTab: state.CurrentTab,
    onChange: (tab: state.CurrentTab) => void
}

export const Tabs = (p: TabsProps) => <div className="tabs">
                            <span className={classNames('tab', {selected: p.currentTab == state.CurrentTab.Medical})} 
                                onClick={(e) => p.onChange(state.CurrentTab.Medical)}>
                                    Medical</span> 
                            <span className={classNames('tab', {selected: p.currentTab == state.CurrentTab.FeelingToday})} 
                                onClick={(e) => p.onChange(state.CurrentTab.FeelingToday)}>
                                Health Check</span>
                            <span className={classNames('tab', {selected: p.currentTab == state.CurrentTab.CovidDiary})} 
                                onClick={(e) => p.onChange(state.CurrentTab.CovidDiary)}>
                                Covid Diary</span>   
                            <span className={classNames('tab', {selected: p.currentTab == state.CurrentTab.Sharing})} 
                                onClick={(e) => p.onChange(state.CurrentTab.Sharing)}>
                                Share</span>
                        </div>