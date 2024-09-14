'use client'
import React from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import * as YUKA from 'yuka'
import { useRef, useEffect } from "react";
import * as THREE from 'three'

export default function LiveMap() {
    const mountRef = useRef(null)

    function createVehicle(pathPoints, maxSpeed = 1, _color){
        const vehicle = new YUKA.Vehicle(); 

        const vehicleMesh = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshBasicMaterial({color: _color})
        );

        function sync(entity, renderComponent){
            renderComponent.matrix.copy(entity.worldMatrix);
        }
        vehicle.setRenderComponent(vehicleMesh, sync)

        //Crear el camio del vehiculo: 
        const path = new YUKA.Path()
        path.loop = false;

        //Puntos del camino: 
        for(let point of pathPoints){
            path.add(point)
        }
        vehicle.position.copy(path_coche1.current());
        vehicle.maxSpeed = maxSpeed;
        vehicle.followPath(path);
        vehicle.arriveThreshold = 0.1; // Ajustar la distancia de llegada al punto

        const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
        vehicle.steering.add(followPathBehavior);

        const onPathBehavior = new YUKA.OnPathBehavior(path);
        onPathBehavior.radius = 0.1;
        vehicle.steering.add(onPathBehavior);

        const entityManager = new YUKA.EntityManager();
        entityManager.add(vehicle);

        return {vehicle, vehicleMesh}
    }

    function createColliderBetweenPoints(pointA, pointB, scene) {
        const distance = pointA.distanceTo(pointB);
        
        // Crear una geometría de caja para el collider
        const colliderGeometry = new THREE.BoxGeometry(0.1, 0.1, distance);
        const colliderMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true, // Cambia esto a `false` si no quieres ver los colliders
            transparent: true,
            opacity: 0.5 // Para que sea semi-transparente
        });
        
        const collider = new THREE.Mesh(colliderGeometry, colliderMaterial);
    
        // Posicionar el collider en el centro del segmento
        const midpoint = new THREE.Vector3().lerpVectors(pointA, pointB, 0.5);
        collider.position.copy(midpoint);
    
        // Rotar el collider para que coincida con la dirección del segmento
        const direction = new THREE.Vector3().subVectors(pointB, pointA).normalize();
        const axis = new THREE.Vector3(0, 0, 1); // Z es el eje por defecto
        const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
        collider.setRotationFromQuaternion(quaternion);
    
        scene.add(collider);
        
        return collider;
    }

    // Actualizar la posición del vehículo
    function checkCollisions(vehicleMesh, colliders) {
        const vehicleBox = new THREE.Box3().setFromObject(vehicleMesh);
        const collidedIndices = []

        // Iterar sobre los colliders y verificar la colisión
        for (let i = 0; i < colliders.length; i++) {
            const colliderBox = new THREE.Box3().setFromObject(colliders[i]);

            if (vehicleBox.intersectsBox(colliderBox)) {
                console.log(`Colisión detectada con el collider de índice ${i}`);

                collidedIndices.push(i);  // Agregar el índice del collider que colisiona al array
            }
        }

        return collidedIndices;  
    }

    useEffect(() => {
        // Configurar la escena
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x808080);
        const camera = new THREE.PerspectiveCamera(
          75, // Campo de visión
          mountRef.current.clientWidth / mountRef.current.clientHeight, // Aspect ratio
          0.1, // Plano cercano
          1000 // Plano lejano
        );
        camera.position.z = 5;
        camera.position.y = 5
        
        // Renderizador
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        
        // Añadir el renderizador al contenedor referenciado
        mountRef.current.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(-2, 0, 3);

        const vehicleGeometry = new THREE.ConeGeometry(0.1, 0.5, 8);
        vehicleGeometry.rotateX(Math.PI * 0.5);
        const vehicleMaterial = new THREE.MeshNormalMaterial();
        const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
        vehicleMesh.matrixAutoUpdate = false;
        scene.add(vehicleMesh);

        // ** --------------------------- YUKA vehicle---------------------- // 
        const vehicle = new YUKA.Vehicle()
        vehicle.setRenderComponent(vehicleMesh, sync)
        function sync(entity, renderComponent) {
            renderComponent.matrix.copy(entity.worldMatrix);
        }
        const path_coche1 = new YUKA.Path()
        
        // Sectors and Paths 
        path_coche1.add(new YUKA.Vector3(0,0,0))
        path_coche1.add(new YUKA.Vector3(-1,0,-1))
        path_coche1.add(new YUKA.Vector3(-2,0,-1.5))
        path_coche1.add(new YUKA.Vector3(-3,0,-0.9))
        path_coche1.add( new YUKA.Vector3(-3, 0, 5));
        path_coche1.add( new YUKA.Vector3(-2, 0, 6));
        path_coche1.add( new YUKA.Vector3(-2, 0, 6));
        path_coche1.add( new YUKA.Vector3(-1, 0, 6));
        
        path_coche1.add( new YUKA.Vector3(-1, 0, -1));
        path_coche1.add( new YUKA.Vector3(-2, 0, -1.5));
        path_coche1.add( new YUKA.Vector3(-3, 0, -0.9));
        path_coche1.add( new YUKA.Vector3(-3, 0, 5));
        path_coche1.add( new YUKA.Vector3(-2, 0, 6));
        path_coche1.add( new YUKA.Vector3(-2, 0, 6));
        path_coche1.add( new YUKA.Vector3(-1, 0, 6));
        path_coche1.add( new YUKA.Vector3(-1, 0, -1));
        
        vehicle.position.copy(path_coche1.current());
        vehicle.maxSpeed = 1; 

        const colliders = []
        for(let i = 0; i < path_coche1._waypoints.length - 1; i++){
            const pointA = path_coche1._waypoints[i];
            const pointB = path_coche1._waypoints[i+1];

            if(i < 8){
                const collider = createColliderBetweenPoints(pointA, pointB, scene); 
                colliders.push(collider);
            }
        }

        const followPathBehavior = new YUKA.FollowPathBehavior(path_coche1, 0.5);
        vehicle.steering.add(followPathBehavior);

        const onPathBehavior = new YUKA.OnPathBehavior(path_coche1);
        onPathBehavior.radius = 0.1;
        vehicle.steering.add(onPathBehavior);

        const entityManager = new YUKA.EntityManager();
        entityManager.add(vehicle);


        // Renderizacion del Path: 
        const position = [];
        for(let i = 0; i < path_coche1._waypoints.length; i++) {
            const waypoint = path_coche1._waypoints[i];
            position.push(waypoint.x, waypoint.y, waypoint.z);
        }

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
        scene.add(lines);

        const time = new YUKA.Time();

        // ---------------------------- Animacion ----------------------------------
        const animate = () => {
            requestAnimationFrame(animate);
            const delta = time.update().getDelta();
            entityManager.update(delta)
            
            // Renderizar la escena
            controls.update()
            renderer.render(scene, camera);

            const collidingColliders = checkCollisions(vehicleMesh, colliders)

            if (collidingColliders.length > 0) {
                console.log("El vehículo está colisionando con los siguientes colliders:", collidingColliders);
            }
        };
    
        animate();
        
        // Función para manejar el redimensionamiento de la ventana
        const handleResize = () => {
            // Actualizar el aspect ratio de la cámara
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
    
            // Actualizar el tamaño del renderizador
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize)
        

        // Limpiar la escena al desmontar el componente
        return () => {
          mountRef.current.removeChild(renderer.domElement);
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return (
        <div className="card" >
        <div className="card-body">
          <h5 className="card-title">Live Map</h5>
          <div ref={mountRef} style={{width: '100%', height: "45vh"}} /> 
        </div>
      </div>
    )
}

