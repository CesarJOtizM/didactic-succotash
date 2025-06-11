'use client';

import type React from 'react';

import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, Badge } from 'src/components';

export interface StatusTabsProps {
	pendingCount: number;
	completedCount: number;
	failedCount: number;
	activeTab: string;
	onTabChange: (tab: string) => void;
	children: React.ReactNode;
}

export function StatusTabs({
	pendingCount,
	completedCount,
	failedCount,
	activeTab,
	onTabChange,
	children
}: StatusTabsProps) {
	return (
		<Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
			<TabsList className="mb-4 grid w-full grid-cols-3">
				<TabsTrigger value="pending" className="relative">
					<div className="flex items-center gap-1">
						<Clock className="mr-1 hidden h-4 w-4 sm:inline" />
						<span>Pendientes</span>
						<Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800">
							{pendingCount}
						</Badge>
					</div>
				</TabsTrigger>
				<TabsTrigger value="completed" className="relative">
					<div className="flex items-center gap-1">
						<CheckCircle className="mr-1 hidden h-4 w-4 sm:inline" />
						<span>Completadas</span>
						<Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">
							{completedCount}
						</Badge>
					</div>
				</TabsTrigger>
				<TabsTrigger value="failed" className="relative">
					<div className="flex items-center gap-1">
						<XCircle className="mr-1 hidden h-4 w-4 sm:inline" />
						<span>Fallidas</span>
						<Badge variant="secondary" className="ml-1 bg-red-100 text-red-800">
							{failedCount}
						</Badge>
					</div>
				</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	);
}
