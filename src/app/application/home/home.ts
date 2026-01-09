import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';

interface StatCard {
  icon: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  iconBg: string;
}

interface RecentOrder {
  orderId: string;
  customer: string;
  product: string;
  status: string;
  amount: string;
  statusSeverity: 'success' | 'warn' | 'info';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    AvatarModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  
  statCards: StatCard[] = [
    {
      icon: 'pi pi-wallet',
      title: 'Total Sales',
      value: '₱12,450',
      change: '+12%',
      isPositive: true,
      iconBg: '#ec4899'
    },
    {
      icon: 'pi pi-users',
      title: 'New Customers',
      value: 128,
      change: '+5%',
      isPositive: true,
      iconBg: '#3b82f6'
    },
    {
      icon: 'pi pi-box',
      title: 'Active Products',
      value: 45,
      change: '0%',
      isPositive: true,
      iconBg: '#f97316'
    },
    {
      icon: 'pi pi-shopping-cart',
      title: 'Pending Orders',
      value: 8,
      change: '+2%',
      isPositive: true,
      iconBg: '#a855f7'
    }
  ];

  recentOrders: RecentOrder[] = [
    {
      orderId: '#ORD-001',
      customer: 'Alex Johnson',
      product: 'Bubble Bath Set',
      status: 'Completed',
      amount: '$45.00',
      statusSeverity: 'success'
    },
    {
      orderId: '#ORD-002',
      customer: 'Maria Garcia',
      product: 'Organic Soap Bundle',
      status: 'Pending',
      amount: '$28.50',
      statusSeverity: 'warn'
    },
    {
      orderId: '#ORD-003',
      customer: 'John Doe',
      product: 'Aroma Candle',
      status: 'Processing',
      amount: '$15.00',
      statusSeverity: 'info'
    }
  ];

  // Chart Configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };

  public barChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [3000, 4000, 2800, 5000, 4200, 3500],
        backgroundColor: '#ec4899',
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  ngOnInit() {
    // Initialize any data fetching here
  }
}
