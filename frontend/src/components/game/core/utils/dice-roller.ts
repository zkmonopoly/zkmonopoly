import { AbstractMesh, Mesh, PhysicsAggregate, PhysicsShapeType, Scene, Vector3 } from "@babylonjs/core";

interface DiceConfiguration {
    dice0Position: Vector3;
    dice1Position: Vector3;
    dice0Rotation: Vector3;
    dice1Rotation: Vector3;
}

// starting positions for dice, first < second
// magic numbers
const StartingPositions: Record<number, Record<number, DiceConfiguration>> = {
  1: {
    1: {
      dice0Position: new Vector3(16.55, 3, -17.70),
      dice1Position: new Vector3(18.25, 3.8, -16.1),
      dice0Rotation: new Vector3(-3.13, -2.23, -1.87),
      dice1Rotation: new Vector3(1.24, -2.75, -2.1)
    },
    2: {
      dice0Position: new Vector3(16.55, 3.91, -17.70),
      dice1Position: new Vector3(18.25, 3.8, -16.1),
      dice0Rotation: new Vector3(-3.13, -2.23, -1.87),
      dice1Rotation: new Vector3(1.24, -2.75, -2.1)
    },
    3: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Backward(),
      dice1Rotation: Vector3.Backward()
    },
    4: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Zero(),
      dice1Rotation: Vector3.Zero()
    },
    5: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Forward(),
      dice1Rotation: Vector3.Backward()
    },
    6: {
      dice0Position: new Vector3(17.150649445455958, 3, -17.68475737126155),
      dice1Position: new Vector3(16.814423915387323, 3.7975182423000797, -17.7339029497044),
      dice0Rotation: new Vector3(2.406980780052466, 2.984124978128309, 0.36044622385701525),
      dice1Rotation: new Vector3(0.7061359393777595, 1.881563659658417, 0.49906302241712763)
    }
  },
  2: {
    2: {
      dice0Position: new Vector3(16.55, 3.91, -17.70),
      dice1Position: new Vector3(18.25, 3.7, -16.3),
      dice0Rotation: new Vector3(-3.13, -2.23, -1.87),
      dice1Rotation: new Vector3(1.24, -2.75, -2.1)
    },
    3: {
      dice0Position: new Vector3(16.55, 3.91, -17.70),
      dice1Position: new Vector3(18.25, 3.7, -16.3),
      dice0Rotation: new Vector3(3.13, -2.23, -1.87),
      dice1Rotation: new Vector3(1.24, -2.75, 2.1)
    },
    4: {
      dice0Position: new Vector3(16.96, 3, -18.76),
      dice1Position: new Vector3(17.6, 3.18, -17.08),
      dice0Rotation: new Vector3(2.25, 1.75, 0.39),
      dice1Rotation: new Vector3(1.27, 0.43, 0.79)
    },
    5: {
      dice0Position: new Vector3(16.55, 3.91, -17.70),
      dice1Position: new Vector3(18.25, 3.7, -16.3),
      dice0Rotation: new Vector3(3.13, 2.23, 1.87),
      dice1Rotation: new Vector3(1.24, -2.75, 2.1)
    },
    6: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(18.25, 3, -16.25),
      dice0Rotation: Vector3.Zero(),
      dice1Rotation: Vector3.Zero()
    }
  },
  3: {
    3: {
      dice0Position: new Vector3(18.25, 1, -16.25),
      dice1Position: new Vector3(16.25, 1, -18.25),
      dice0Rotation: new Vector3(Math.PI / 4, 0, Math.PI / 4),
      dice1Rotation: new Vector3(Math.PI / 4, 0, Math.PI / 4)
    },
    4: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 2.5, -16.25),
      dice0Rotation: Vector3.Zero(),
      dice1Rotation: Vector3.Zero()
    },
    5: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Backward(),
      dice1Rotation: Vector3.Forward()
    },
    6: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Right(),
      dice1Rotation: Vector3.Up()
    }
  },
  4: {
    4: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Zero(),
      dice1Rotation: Vector3.Zero()
    },
    5: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16, 3, -16),
      dice0Rotation: Vector3.Zero(),
      dice1Rotation: Vector3.Zero()
    },
    6: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Zero(),
      dice1Rotation: Vector3.Zero()
    }
  },
  5: {
    5: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Forward(),
      dice1Rotation: Vector3.Forward()
    },
    6: {
      dice0Position: new Vector3(18.25, 3, -18.25),
      dice1Position: new Vector3(16.25, 3, -16.25),
      dice0Rotation: Vector3.Right(),
      dice1Rotation: Vector3.Backward()
    }
  },
  6: {
    6: {
      dice0Position: new Vector3(18.25, 1, -16.25),
      dice1Position: new Vector3(16.25, 1, -18.25),
      dice0Rotation: new Vector3(Math.PI / 2, 0, Math.PI / 2),
      dice1Rotation: new Vector3(Math.PI / 2, 0, Math.PI / 2)
    }
  }
};

export class DiceRollerFactory {
  static async createFromLoadedMesh(loadedMesh: AbstractMesh, scene: Scene): Promise<DiceRoller> {
    const mesh = await Mesh.MergeMeshesAsync(
      loadedMesh.getChildMeshes(),
      true,
      true,
      undefined,
      false,
      true
    ) as AbstractMesh;
    mesh.name = "dice";
    return new DiceRoller(mesh, scene);
  }
}

export class DiceRoller {
  private originalMesh: AbstractMesh;
  private meshes: AbstractMesh[] = [];
  private physicsAggregates: PhysicsAggregate[] = [];
  private scene: Scene;
  constructor(mesh: AbstractMesh, scene: Scene) {
    this.originalMesh = mesh;
    this.originalMesh.isVisible = false;
    this.scene = scene;
  }

  roll(result0: number, result1: number) {
    if (result0 > result1) {
      [result0, result1] = [result1, result0];
    }
    // dispose of old meshes and physics aggregates
    this.physicsAggregates.forEach((aggregate) => {
      aggregate.dispose();
    });
    this.physicsAggregates = [];
    this.meshes.forEach((mesh) => {
      mesh.dispose();
    });
    this.meshes = [];
    // clone invisible meshes and set them to visible
    this.meshes.push(this.originalMesh.clone("tempDice0", null)!);
    this.meshes.push(this.originalMesh.clone("tempDice1", null)!);
    this.meshes.forEach((mesh) => {
      mesh.isVisible = true;
    });
    let config: DiceConfiguration;
    try {
      config = StartingPositions[result0][result1];
    } catch (e) {
      throw new Error(`Invalid dice roll: ${result0}, ${result1}`);
    }
    this.meshes[0].position = config.dice0Position.clone();
    this.meshes[1].position = config.dice1Position.clone();
    this.meshes[0].rotation = config.dice0Rotation.clone();
    this.meshes[1].rotation = config.dice1Rotation.clone();
    // create physics aggregates
    this.physicsAggregates.push(new PhysicsAggregate(
      this.meshes[0],
      PhysicsShapeType.MESH,
      { mass: 1 },
      this.scene
    ));
    this.physicsAggregates.push(new PhysicsAggregate(
      this.meshes[1],
      PhysicsShapeType.MESH,
      { mass: 1 },
      this.scene
    ));
  }
}