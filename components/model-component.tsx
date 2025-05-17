"use client"

import { useEffect, useState } from "react"
import { useThree } from "@react-three/fiber"
import { useLoader, Center } from "@react-three/drei"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { Mesh, MeshStandardMaterial } from "three"
import LoadingSpinner from "./loading-spinner"

export default function ModelComponent({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const { camera } = useThree()
  
  // Check file extension to determine which loader to use
  const isStlFile = url.toLowerCase().endsWith('.stl')
  
  // Load the STL geometry
  const geometry = isStlFile ? useLoader(STLLoader, url) : null
  
  useEffect(() => {
    // Reset camera position when model changes - position higher to account for prompt container
    camera.position.set(0, 0, 5)

    // Set loading to false when geometry is loaded
    if (geometry) {
      setIsLoading(false)
    }

    return () => {
      setIsLoading(true)
    }
  }, [url, camera, geometry])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isStlFile && geometry) {
    return (
      <Center>
        <mesh scale={0.05}>
          <primitive object={geometry} />
          <meshStandardMaterial color="#cccccc" roughness={0.5} metalness={0.5} />
        </mesh>
      </Center>
    )
  }

  // Fallback for non-STL files (should not happen with our changes)
  return <LoadingSpinner />
}