'use server'

import {
  updateSiteSection,
  resetSiteSectionToDefault,
  getAllSiteContent
} from '@/lib/content/cms'
import { SiteContentData } from '@/lib/content/default-content'

export async function saveHeroSectionAction(data: any) {
  try {
    const payload = {
      badge: String(data.badge || '').trim(),
      title: String(data.title || '').trim(),
      titleHighlight: String(data.titleHighlight || '').trim(),
      subtitle: String(data.subtitle || '').trim(),
      description: String(data.description || '').trim(),
      primaryCtaText: String(data.primaryCtaText || '').trim(),
      primaryCtaLink: String(data.primaryCtaLink || '').trim(),
      secondaryCtaText: String(data.secondaryCtaText || '').trim(),
      secondaryCtaLink: String(data.secondaryCtaLink || '').trim(),
      tertiaryCtaText: String(data.tertiaryCtaText || '').trim(),
      tertiaryCtaLink: String(data.tertiaryCtaLink || '').trim(),
      stat1Value: String(data.stat1Value || '').trim(),
      stat1Label: String(data.stat1Label || '').trim(),
      stat2Value: String(data.stat2Value || '').trim(),
      stat2Label: String(data.stat2Label || '').trim(),
      stat3Status: String(data.stat3Status || '').trim(),
      stat3Label: String(data.stat3Label || '').trim(),
    }

    return await updateSiteSection('hero', payload)
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveAnnouncementAction(data: any) {
  try {
    const payload = {
      enabled: Boolean(data.enabled),
      badge: String(data.badge || '').trim(),
      message: String(data.message || '').trim(),
      linkText: String(data.linkText || '').trim(),
      linkUrl: String(data.linkUrl || '').trim(),
    }

    return await updateSiteSection('announcement', payload)
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveAboutAction(data: any) {
  try {
    const payload = {
      badge: String(data.badge || '').trim(),
      pageTitle: String(data.pageTitle || '').trim(),
      pageSubtitle: String(data.pageSubtitle || '').trim(),
      mission: {
        title: String(data.missionTitle || 'Our Mission').trim(),
        description: String(data.missionDescription || '').trim()
      },
      vision: {
        title: String(data.visionTitle || 'Our Vision').trim(),
        description: String(data.visionDescription || '').trim()
      },
      coreValues: {
        title: String(data.coreValuesTitle || 'Core Values').trim(),
        description: String(data.coreValuesDescription || '').trim()
      },
      heritageBadge: String(data.heritageBadge || '').trim(),
      heritageTitle: String(data.heritageTitle || '').trim(),
      heritageParagraphs: Array.isArray(data.heritageParagraphs) 
        ? data.heritageParagraphs 
        : typeof data.heritageParagraphsText === 'string'
          ? data.heritageParagraphsText.split('\n\n').filter(Boolean)
          : [],
      homeNarrativeBadge: String(data.homeNarrativeBadge || '').trim(),
      homeNarrativeTitle: String(data.homeNarrativeTitle || '').trim(),
      homeNarrativeText: String(data.homeNarrativeText || '').trim()
    }

    return await updateSiteSection('about', payload)
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveProgrammesAction(data: any) {
  try {
    return await updateSiteSection('programmes', data)
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveSettingsAction(data: any) {
  try {
    const duesAmountNumeric = Number(String(data.duesAmount || '').replace(/[^0-9]/g, '')) || 5000
    const payload = {
      motto: String(data.motto || '').trim(),
      footerDescription: String(data.footerDescription || '').trim(),
      physicalAddress: String(data.physicalAddress || '').trim(),
      contactEmail: String(data.contactEmail || '').trim(),
      phoneNumber: String(data.phoneNumber || '').trim(),
      duesAmount: String(data.duesAmount || '₦5,000').trim(),
      duesAmountNumeric,
      academicSession: String(data.academicSession || '2025/2026').trim(),
      facebookUrl: String(data.facebookUrl || '').trim(),
      twitterUrl: String(data.twitterUrl || '').trim(),
      linkedinUrl: String(data.linkedinUrl || '').trim(),
    }

    return await updateSiteSection('settings', payload)
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resetSectionAction(section: keyof SiteContentData) {
  try {
    return await resetSiteSectionToDefault(section)
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
