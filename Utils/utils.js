import { Vector3 } from "three";
import { vec3 } from "./vec";
import { EDirection } from "../Voxel/enums";

export const EUnitV3 =
{
    ForwardVector   : new vec3( 1, 0, 0),
    RightVector     : new vec3( 0, 0, 1),
    BackwardVector  : new vec3(-1, 0, 0),
    LeftVector      : new vec3( 0, 0,-1),
    UpwardVector    : new vec3( 0, 1, 0),
    DownwardVector  : new vec3( 0,-1, 0)
};

export const EDirV3 =
[
    new vec3( 1 , 0 , 0 ),  // ForwardVector 
    new vec3( 0 , 0 , 1 ),  // RightVector   
    new vec3(-1 , 0 , 0 ),  // BackwardVector
    new vec3( 0 , 0 ,-1 ),  // LeftVector    
    new vec3( 0 , 1 , 0 ),  // UpwardVector  
    new vec3( 0 ,-1 , 0 )   // DownwardVector
];
export const EDirArr =
[
    [ 1 , 0 , 0 ],  // ForwardVector 
    [ 0 , 0 , 1 ],  // RightVector   
    [-1 , 0 , 0 ],  // BackwardVector
    [ 0 , 0 ,-1 ],  // LeftVector    
    [ 0 , 1 , 0 ],  // UpwardVector  
    [ 0 ,-1 , 0 ]   // DownwardVector
];

export const ThreeUnitV3 =
{
    ForwardVector   : new Vector3( 1, 0, 0),
    RightVector     : new Vector3( 0, 0, 1),
    BackwardVector  : new Vector3(-1, 0, 0),
    LeftVector      : new Vector3( 0, 0,-1),
    UpwardVector    : new Vector3( 0, 1, 0),
    DownwardVector  : new Vector3( 0,-1, 0)
};

export const ThreeAxis =
{
    X: new Vector3(1,0,0),
    Y: new Vector3(0,1,0),
    Z: new Vector3(0,0,1)
};

export function rayCube(start/*Array vector3*/, dir/*Array vector3*/, minB, maxB)
{
    let inside = true;
	let quadrant = [];
	let whichPlane;
	let maxT = [];
	let candidatePlane = [];

    let coord = [];

	/* Find candidate planes; this loop can be avoided if
   	rays cast all from the eye(assume perpsective view) */
	for (let i=0; i < 3; i++)
		if(start[i] < minB[i]) {
			quadrant[i] = EDirection.Left;
			candidatePlane[i] = minB[i];
			inside = false;
		}else if (origin[i] > maxB[i]) {
			quadrant[i] = EDirection.Right;
			candidatePlane[i] = maxB[i];
			inside = false;
		}else {
			quadrant[i] = -1;
		}

	/* Ray origin inside bounding box */
	if(inside) {
		return origin;
	}


	/* Calculate T distances to candidate planes */
	for (i = 0; i < 3; i++)
		if (quadrant[i] != -1 && dir[i] !=0)
			maxT[i] = (candidatePlane[i]-origin[i]) / dir[i];
		else
			maxT[i] = -1;

	/* Get largest of the maxT's for final choice of intersection */
	whichPlane = 0;
	for (let i = 1; i < 3; i++)
		if (maxT[whichPlane] < maxT[i])
			whichPlane = i;

	/* Check final candidate actually inside box */
	if (maxT[whichPlane] < 0) return (FALSE);
	for (let i = 0; i < 3; i++)
		if (whichPlane != i) {
			coord[i] = origin[i] + maxT[whichPlane] *dir[i];
			if (coord[i] < minB[i] || coord[i] > maxB[i])
				return false;
		} else {
			coord[i] = candidatePlane[i];
		}
	return coord;	
}

export function intersectAABB(a, b) {
    return (
      a.minX <= b.maxX &&
      a.maxX >= b.minX &&
      a.minY <= b.maxY &&
      a.maxY >= b.minY &&
      a.minZ <= b.maxZ &&
      a.maxZ >= b.minZ
    );
}