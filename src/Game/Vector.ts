export const clamp = (n: number, min: number, max: number): number => Math.min(Math.max(n, min), max);
/** Class representing a Vector. */
export default class Vector {
  /** The x value of the vector. */
  public x: number;
  /** The y value of the vector. */
  public y: number;
  /** The z value of the vector. */
  public z: number;
  /**
    * Create a Vector.
    * @param {number} x - The x value.
    * @param {number} y - The y value.
    * @param {number} [z=] - The z value.
    */
  constructor(x: number, y: number, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  // Methods
  /**
    * Clones The Given Vector.
    * @return {Vector} Returns the new Vector.
    */
  public clone(): Vector {
    return new Vector(this.x, this.y, this.z);
  }
  public copy(vec: Vector): Vector {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    return this;
  }
  /**
    * Set the x, y, z values of a Vector.
    * @param {number} x - The new x value.
    * @param {number} y - The new y Value.
    * @param {number} [z=] - The new z Value.
    * @return {Vector} Returns the Vector.
    */
  public set(x: number, y: number, z: number = 0): Vector {
    this.x = x;
    this.y = y;
    this.z = z ?? this.z;
    return this;
  }
  /**
    * Add's the x, y, z values to the Vector.
    * @param {number} x - The add x value.
    * @param {number} y - The add y Value.
    * @param {number} [z=] - The add z Value.
    * @return {Vector} Returns the Vector.
    */
  public add(x: number, y: number, z: number = 0): Vector {
    this.x += x;
    this.y += y;
    this.z += z;
    return this;
  }
  /**
    * Adds the Vector.
    * @param {Vector} vec - The vec to add.
    * @return {Vector} Returns the Vector.
    */
  public addVector(vec: Vector): Vector {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }
  /**
    * Adds the scalar.
    * @param {number} scalar - The scalar.
    * @return {Vector} Returns the Vector.
    */
  public addScalar(scalar: number): Vector {
    this.x += scalar;
    this.y += scalar;
    this.z += scalar;
    return this;
  }
  /**
    * Sub's the x, y, z values to the Vector.
    * @param {number} x - The add x value.
    * @param {number} y - The add y Value.
    * @param {number} [z=] - The add z Value.
    * @return {Vector} Returns the Vector.
    */
  public sub(x: number, y: number, z: number = 0): Vector {
    this.x -= x;
    this.y -= y;
    this.z -= z;
    return this;
  }
  /**
    * Subtracts the Vector.
    * @param {Vector} vec - The vec to sub value.
    * @return {Vector} Returns the Vector.
    */
  public subVector(vec: Vector): Vector {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    return this;
  }
  /**
    * Subtracts the scalar.
    * @param {number} scalar - The scalar.
    * @return {Vector} Returns the Vector.
    */
  public subScalar(scalar: number): Vector {
    this.x -= scalar;
    this.y -= scalar;
    this.z -= scalar;
    return this;
  }
   /**
    * Multiplys the x, y, z values to the Vector.
    * @param {number} x - The add x value.
    * @param {number} y - The add y Value.
    * @param {number} [z=] - The add z Value.
    * @return {Vector} Returns the Vector.
    */
  public mul(x: number, y: number, z: number = 1): Vector {
    this.x *= x;
    this.y *= y;
    this.z *= z;
    return this;
  }
  /**
    * Multiplys the Vector.
    * @param {Vector} vec - The vec to sub value.
    * @return {Vector} Returns the Vector.
    */
  public mulVector(vec: Vector): Vector {
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
    return this;
  }
  /**
    * Mulptiplys the scalar.
    * @param {number} scalar - The scalar.
    * @return {Vector} Returns the Vector.
    */
  public mulScalar(scalar: number): Vector {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  /**
    * divides the x, y, z values to the Vector.
    * @param {number} x - The add x value.
    * @param {number} y - The add y Value.
    * @param {number} [z=] - The add z Value.
    * @return {Vector} Returns the Vector.
    */
  public div(x: number, y: number, z: number = 1): Vector {
    this.x /= x;
    this.y /= y;
    this.z /= z;
    return this;
  }
  /**
    * Divides the Vector.
    * @param {Vector} vec - The vec to sub value.
    * @return {Vector} Returns the Vector.
    */
  public divVector(vec: Vector): Vector {
    this.x /= vec.x;
    this.y /= vec.y;
    this.z /= vec.z;
    return this;
  }
  /**
    * divides the scalar.
    * @param {number} scalar - The scalar.
    * @return {Vector} Returns the Vector.
    */
  public divScalar(scalar: number): Vector {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }
  /**
    * Checks if two vectors are equal.
    * @param {Vector} vec - The vector to check agaist.
    * @return {boolean} Returns the Distance.
    */
  public equals(vec: Vector): boolean {
		return this.x == vec.x && this.y == vec.y && this.z == vec.z;
	}
  /**
    * Lerps between two vectors.
    * @param {Vector} vec - The vector to lerp towards.
    * @return {number} Returns the Distance.
    */
  public lerp(vec: Vector, alpha: number): Vector {
		this.x += (vec.x - this.x) * alpha;
		this.y += (vec.y - this.y) * alpha;
		this.z += (vec.z - this.z) * alpha;
		return this;
	}
  /**
    * Get the Squared Distance Between 2 Vectors.
    * @param {Vector} vec - The distance To Compare Agaist.
    * @return {number} Returns the Distance.
    */
  public distanceToSquared(vec: Vector): number {
		const dx = this.x - vec.x, dy = this.y - vec.y, dz = this.z - vec.z;
		return dx * dx + dy * dy + dz * dz;
	}
  public distanceTo(vec: Vector): number {
		const dx = this.x - vec.x, dy = this.y - vec.y, dz = this.z - vec.z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}
  public angleTo(vec: Vector): number {
		const denominator = Math.sqrt(this.lengthSq() * vec.lengthSq() );
		if (denominator === 0) return Math.PI / 2;
		const theta = this.dot(vec) / denominator;
		// clamp, to handle numerical problems
    return Math.acos(clamp(theta, -1, 1));
	}
  public dot(vec: Vector): number {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}
  public normalize(): Vector {
		return this.divScalar(this.length() || 1);
	}
  public lengthSq(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
  public length(): number {
		return Math.sqrt(this.lengthSq());
	}
  public round(): Vector {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }
}