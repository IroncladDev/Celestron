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
}