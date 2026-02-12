# Ad Rewards Platform with Internet Identity Authentication

## Overview
A platform where users can watch advertisements to earn points and redeem rewards, with separate access for users and administrators through Internet Identity authentication.

## Authentication System
- **Internet Identity Integration**: All users must authenticate using Internet Identity before accessing any functionality
- **User Roles**: Two distinct user types - regular users and administrators
- **Login Requirement**: Authentication is mandatory for all platform features

## User Features
- **Ad Viewing**: Users can watch advertisements to earn points
- **Points System**: Track accumulated points from watching ads
- **Rewards Redemption**: Users can redeem earned points for rewards
- **Account Management**: View personal point balance and redemption history

## Administrator Features
- **Admin Dashboard**: Dedicated interface for platform management
- **Ad Management**: Create, edit, and manage advertisements displayed to users
- **Payout Management**: Handle and process user reward redemption requests
- **User Analytics**: View platform usage and user engagement metrics

## Backend Data Storage
- **User Profiles**: Store user authentication data, point balances, and redemption history
- **Advertisement Data**: Store ad content, metadata, and tracking information
- **Payout Requests**: Manage pending and completed reward redemption requests
- **Admin Accounts**: Maintain administrator access credentials and permissions

## Core Operations
- **Authentication Verification**: Validate Internet Identity credentials and user roles
- **Point Tracking**: Award points for completed ad views and deduct for redemptions
- **Ad Serving**: Deliver advertisements to authenticated users
- **Payout Processing**: Handle reward redemption workflows from request to completion
