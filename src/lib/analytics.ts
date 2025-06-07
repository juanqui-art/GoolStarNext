// src/lib/analytics.ts
import { sendGAEvent } from '@next/third-parties/google';

// Tipos para eventos de Google Analytics
export interface GAEvent {
    action: string;
    category: string;
    label?: string;
    value?: number;
}

// Funciones de tracking específicas para GoolStar

// ⚽ Eventos de navegación
export const trackPageView = (page_title: string, page_location: string) => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
        sendGAEvent({
            event: 'page_view',
            page_title,
            page_location,
        });
    }
};

// 🏆 Eventos de torneos
export const trackTournamentView = (tournament_name: string, tournament_id: string) => {
    sendGAEvent({
        event: 'view_tournament',
        tournament_name,
        tournament_id,
        category: 'tournament',
    });
};

export const trackTournamentStats = (stat_type: 'tabla' | 'goleadores' | 'equipos' | 'partidos') => {
    sendGAEvent({
        event: 'view_tournament_stats',
        stat_type,
        category: 'tournament',
    });
};

// ⚽ Eventos de equipos
export const trackTeamView = (team_name: string, team_id: string) => {
    sendGAEvent({
        event: 'view_team',
        team_name,
        team_id,
        category: 'team',
    });
};

// 🥅 Eventos de partidos
export const trackMatchView = (match_id: string, teams: string) => {
    sendGAEvent({
        event: 'view_match',
        match_id,
        teams,
        category: 'match',
    });
};

// 📊 Eventos de goleadores
export const trackTopScorersView = () => {
    sendGAEvent({
        event: 'view_top_scorers',
        category: 'statistics',
    });
};

// 📋 Eventos de tabla de posiciones
export const trackLeagueTableView = () => {
    sendGAEvent({
        event: 'view_league_table',
        category: 'statistics',
    });
};

// 📞 Eventos de contacto
export const trackContactClick = (contact_type: 'whatsapp' | 'phone' | 'form') => {
    sendGAEvent({
        event: 'contact_click',
        contact_type,
        category: 'engagement',
    });
};

// 📱 Eventos de redes sociales
export const trackSocialShare = (platform: 'facebook' | 'twitter' | 'whatsapp', content_type: string) => {
    sendGAEvent({
        event: 'share',
        method: platform,
        content_type,
        category: 'social',
    });
};

// 🔍 Eventos de búsqueda
export const trackSearch = (search_term: string, search_category: string) => {
    sendGAEvent({
        event: 'search',
        search_term,
        search_category,
        category: 'engagement',
    });
};

// 📝 Eventos de inscripción
export const trackRegistrationInterest = (action: 'form_start' | 'form_submit' | 'contact_click') => {
    sendGAEvent({
        event: 'registration_interest',
        action,
        category: 'conversion',
    });
};

// 🎯 Eventos de navegación principal
export const trackMainNavigation = (destination: string) => {
    sendGAEvent({
        event: 'navigation_click',
        destination,
        category: 'navigation',
    });
};

// 📊 Evento genérico personalizado
export const trackCustomEvent = (event: GAEvent) => {
    sendGAEvent({
        event: 'custom_event',
        action: event.action,
        category: event.category,
        label: event.label,
        value: event.value,
    });
};

// 🏅 Eventos de métricas deportivas
export const trackSportMetric = (metric_type: 'goal' | 'card' | 'match_result', details: string) => {
    sendGAEvent({
        event: 'sport_metric',
        metric_type,
        details,
        category: 'sports',
    });
};

// 📱 Seguimiento de engagement por tiempo en página
export const trackEngagement = (page: string, time_on_page: number) => {
    sendGAEvent({
        event: 'user_engagement',
        page,
        engagement_time_msec: time_on_page,
        category: 'engagement',
    });
};