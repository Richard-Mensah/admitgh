"use client"
// hooks/useRegionFilter.ts
// Region + institution type filter state for the results page

import { useState, useCallback } from "react"
import type { GhanaRegion, InstitutionType } from "@/constants"

export function useRegionFilter() {
  const [selectedRegions, setSelectedRegions] = useState<GhanaRegion[]>([])
  const [selectedTypes, setSelectedTypes] = useState<InstitutionType[]>([])

  const toggleRegion = useCallback((region: GhanaRegion) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    )
  }, [])

  const toggleType = useCallback((type: InstitutionType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }, [])

  const clearAll = useCallback(() => {
    setSelectedRegions([])
    setSelectedTypes([])
  }, [])

  const isActive = selectedRegions.length > 0 || selectedTypes.length > 0

  return {
    selectedRegions,
    selectedTypes,
    toggleRegion,
    toggleType,
    clearAll,
    isActive,
  }
}
