/**
 *  Input UI interactions - Form controllers
 *  
 *  @description
 *  Input schema configuration for input field required.
 *  defines the structure and constraints for inputforms
 *  group by concept of numerical methods with input 2D arrays represented.
 *  
 *  Structure :
 *  {
 *    [topic: string]: {
 *      [methodKey: string]: ## Inner Structure ##
 *    }
 *  }
 * 
 *  Inner Structure :
 *  {
 *    size?: {
 *      label: string,
 *      min: number,
 *      max: number
 *    },
 *    inputs {
 *       [key: string]: {
 *          shape: function(size): number[] | null,
 *          type: string, // "number", "string", "select"
 *          min?: number,
 *          max?: number,
 *          options?: Array<{value: any, label?: string}>
 *       }
 *    }
 *  }
 *  
 * 
 *  @property {object}   topic                - Display the topic.
 *  @property {object}   method               - Display the method configs.
 *  
 * 
 *  @property {object}   size                 - Global matries size.
 *  @property {string}   size.label           - Label description.
 *  @property {number}   size.min             - Global matries min size.
 *  @property {number}   size.max             - Global matries max size.
 *  
 *  @property {object}   inputs               - Mapped input fields.
 *  @property {object}   inputs._key          - Each field defines a matrix input.
 *  @property {function} inputs._key.shape    - Function ret the 2D shape of input.
 *  @property {string}   inputs._key.type     - Input type (number, string, select).
 *  @property {number}   inputs._key.min      - Input min value allowed (number type). 
 *  @property {number}   inputs._key.max      - Input max value allowed (number type).
 *  @property {Array}    inputs._key.options  - Options (select type)
 */
export const inputSchemas = {
  root_equation: {
    bisection: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        xl: {
          shape: () => null,
          type: "number",
          min: 1e-6, 
          max: 1e6 
        },
        xr: {
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        }
      }
    },
    false_position: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        xl: {
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        xr: {
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        }
      }
    },
    fixed_point: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        x: {
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        }
      }
    },
    taylor: {
      inputs: {
        equation: {
          shape: () => null, 
          type: "string" 
        },
        x: {
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        }
      }
    },
    newton_raphson: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        x: {
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        }
      }
    },
    secant: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        x0: {
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        x1: {
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6
         }
      }
    }
  },
  linear_equation: {
    cramer: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
    guass_naive: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
    guass_jordan: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
    inverse: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
    LU: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
    cholesky: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
    jacobi: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
        init: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
    guass_seidel: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
        init: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
    over_relaxation: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
        init: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
        omega: {
          shape: () => null,
          type: "number",
          min: 0.000001,
          max: 1.999999
        }
      }
    },
    conjugate_gradient: {
      size: {
        label: "Matric Size",
        min: 2,
        max: 6
      },
      inputs: {
        A: {
          shape: (size) => [size, size],
          type: "number",
          min: -1000,
          max: 1000
        },
        b: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
        init: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
      }
    },
  },
  interpolation: {
    newton_divided: {
      size: {
        label: "Number of Points",
        min: 2,
        max: 10
      },
      inputs: {
        x: {
          shape: (size) => [1, size],
          type: "number",
          min: -500,
          max: 500
        },
        y: {
          shape: (size) => [1, size],
          type: "number",
          min: -500,
          max: 500
        },
        target_x: {
          shape: () => null,
          type: "number",
          min: -500,
          max: 500
        }
      }
    },
    lagrange: {
      size: {
        label: "Number of Points",
        min: 2,
        max: 10
      },
      inputs: {
        x: {
          shape: (size) => [1, size],
          type: "number",
          min: -500,
          max: 500
        },
        y: {
          shape: (size) => [1, size],
          type: "number",
          min: -500,
          max: 500
        },
        target_x: {
          shape: () => null,
          type: "number",
          min: -500,
          max: 500
        }
      }
    },
    spline: {
      size: {
        label: "Number of Points",
        min: 2,
        max: 10
      },
      inputs: {
        x: {
          shape: (size) => [1, size],
          type: "number",
          min: -200,
          max: 200
        },
        y: {
          shape: (size) => [1, size],
          type: "number",
          min: -200,
          max: 200
        },
        target_x: {
          shape: () => null,
          type: "number",
          min: -200,
          max: 200
        },
        degree: {
          shape: () => null,
          type: "number",
          min: 2,
          max: 5
        }
      }
    }
  },
  regression: {
    least_square: {
      size: {
        label: "Number of Point",
        min: 2,
        max: 20
      },
      inputs: {
        x: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
        y: {
          shape: (size) => [size, 1],
          type: "number",
          min: -1000,
          max: 1000
        },
        degree: {
          shape: () => null,
          type: "number",
          min: 0,
          max: 4
        }
      }
    },
    multi_least_square: {
      size: {
        label: "Number of Point",
        min: 2,
        max: 10
      },
      inputs: {
        x: {
          shape: (size) => [size, 1],
          type: "number",
          min: -100,
          max: 100
        },
        y: {
          shape: (size) => [size, 1],
          type: "number",
          min: -100,
          max: 100
        },
        degree: {
          shape: () => null,
          type: "number",
          min: 0,
          max: 4
        }
      }
    },
    degree_combinations: {
      size: {
        label: "Number of Degree",
        min: 2,
        max: 5
      },
      inputs: {
        degree: {
          shape: (size) => [size, 1],
          type: "number",
          min: 0,
          max: 4
        }
      }
    },
  },
  integration: {
    trapezodial: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        xl: { 
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        xr: { 
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        trapezoid_count: { 
          shape: () => null,
          type: "number", 
          min: 1, 
          max: 100 
        }
      }
    },
    simpson_1in3: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        xl: { 
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        xr: { 
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        trapezoid_count: { 
          shape: () => null,
          type: "number", 
          min: 1, 
          max: 100
        }
      }
    },
    simpson_3in8: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        xl: { 
          shape: () => null,
          type: "number", 
          min: 1e-6,
          max: 1e6 
        },
        xr: { 
          shape: () => null,
          type: "number", 
          min: 1e-6,
          max: 1e6 
        },
        trapezoid_count: { 
          shape: () => null,
          type: "number", 
          min: 1, 
          max: 100 
        }
      }
    },
    romberg: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        xl: { 
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        xr: { 
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        }
      }
    },
    guass: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        xl: { 
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        xr: { 
          shape: () => null,
          type: "number", 
          min: 1e-6, 
          max: 1e6 
        },
        points: {
          shape: () => null,
          type: "number",
          min: 1,
          max: 16
        }
      }
    }
  },
  differential: {
    derivative: {
      inputs: {
        equation: { 
          shape: () => null,
          type: "string" 
        },
        x: { 
          shape: () => null,
          type: "number", 
          min: 1e-4, 
          max: 1e4 
        },
        h: { 
          shape: () => null,
          type: "select",
          options: [
            { value: 1e-8, label: "0.00000001" },
            { value: 1e-7, label: "0.0000001" },
            { value: 1e-6, label: "0.000001" },
            { value: 1e-5, label: "0.00001" },
            { value: 1e-4, label: "0.0001" },
            { value: 1e-3, label: "0.001" },
            { value: 1e-2, label: "0.01" },
            { value: 5e-2, label: "0.05" },
            { value: 1e-1, label: "0.1" },
          ],
        },
        method_type: { 
          shape: () => null,
          type: "select", 
          options: [
            { value: 1, label: "Forward Difference" },
            { value: 2, label: "Backward Difference" },
            { value: 3, label: "Central Difference" },
          ]
        },
        precision_type: {
          shape: () => null,
          type: "select",
          options: [
            { value: 1, label: "1st Precision" },
            { value: 2, label: "2nd Precision" },
            { value: 3, label: "3rd Precision" },
          ]
        },
        diff_times: {
          shape: () => null,
          type: "select",
          options: [
            { value: 1, label: "First derivative (f′)" },
            { value: 2, label: "Second derivative (f″)" },
            { value: 3, label: "Third derivative (f‴)" },
            { value: 4, label: "Fourth derivative (f⁗)" },
          ]
        }
      }
    }
  }
}