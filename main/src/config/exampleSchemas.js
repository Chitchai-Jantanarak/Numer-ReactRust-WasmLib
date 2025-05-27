/**
 *  Example input form setter
 * 
 *  @description
 *  A bunch of example inputs that should be set in pages.
 *  Be implemented, use in sections split by list(key) of items
 * 
 *  Structure :
 *  {
 *      [topic: string]: {
 *          [methodKey: string]: ## Inner Structure ##
 *      }
 *  }
 * 
 *  Inner Structure :
 *  {
 *      [examples: string] : [
 *          {
 *              name: string,
 *              inputs: {
 *                  [key: string] : any
 *              }
 *          }
 *      ]
 *  }
 * 
 *  @property {object}   topic                - Display the topic.
 *  @property {object}   method               - Display the method configs.
 * 
 *  @property {object}   examples             - An examples section for extensibility.
 *  @property {string}   name                 - Example's name.
 *  @property {object}   inputs               - Input params link with inputSchemas.
 */
export const exampleSchemas = {
  root_equation: {
    bisection: {
      examples: [
        {
          name: "Example 1: x^2 - 4",
          inputs: {
            equation: "x^2 - 4",
            xl: 0,
            xr: 3,
          },
        },
        {
          name: "Example 2: x^3 - x - 2",
          inputs: {
            equation: "x^3 - x - 2",
            xl: 1,
            xr: 2,
          },
        },
      ],
    },
    false_position: {
      examples: [
        {
          name: "Example 1: x^2 - 4",
          inputs: {
            equation: "x^2 - 4",
            xl: 0,
            xr: 3,
          },
        },
        {
          name: "Example 2: x^3 - x - 2",
          inputs: {
            equation: "x^3 - x - 2",
            xl: 1,
            xr: 2,
          },
        },
      ],
    },
    fixed_point: {
      examples: [
        {
          name: "Example 1: x = sqrt(4)",
          inputs: {
            equation: "sqrt(4)",
            x: 1,
          },
        },
        {
          name: "Example 2: x = (2 + x^3)/(3*x^2)",
          inputs: {
            equation: "(2 + x^3)/(3*x^2)",
            x: 1,
          },
        },
      ],
    },
    newton_raphson: {
      examples: [
        {
          name: "Example 1: x^2 - 4",
          inputs: {
            equation: "x^2 - 4",
            x: 1,
          },
        },
        {
          name: "Example 2: x^3 - x - 2",
          inputs: {
            equation: "x^3 - x - 2",
            x: 1.5,
          },
        },
      ],
    },
    secant: {
      examples: [
        {
          name: "Example 1: x^2 - 4",
          inputs: {
            equation: "x^2 - 4",
            x0: 1,
            x1: 2,
          },
        },
        {
          name: "Example 2: x^3 - x - 2",
          inputs: {
            equation: "x^3 - x - 2",
            x0: 1,
            x1: 2,
          },
        },
      ],
    },
  },
  linear_equation: {
    cramer: {
      examples: [
        {
          name: "Example 1: 2x2 System",
          inputs: {
            A: [
              [2, 1],
              [1, 3],
            ],
            b: [[5], [7]],
          },
        },
        {
          name: "Example 2: 3x3 System",
          inputs: {
            A: [
              [3, 1, 2],
              [2, 4, 1],
              [1, 2, 3],
            ],
            b: [[10], [12], [13]],
          },
        },
      ],
    },
    guass_naive: {
      examples: [
        {
          name: "Example 1: 2x2 System",
          inputs: {
            A: [
              [2, 1],
              [1, 3],
            ],
            b: [[5], [7]],
          },
        },
        {
          name: "Example 2: 3x3 System",
          inputs: {
            A: [
              [3, 1, 2],
              [2, 4, 1],
              [1, 2, 3],
            ],
            b: [[10], [12], [13]],
          },
        },
      ],
    },
  },
  interpolation: {
    newton_divided: {
      examples: [
        {
          name: "Example 1: 3 Points",
          inputs: {
            x: [[1, 2, 3]],
            y: [[1, 4, 9]],
            target_x: 2.5,
          },
        },
        {
          name: "Example 2: 4 Points",
          inputs: {
            x: [[0, 1, 2, 3]],
            y: [[1, 2, 4, 8]],
            target_x: 1.5,
          },
        },
      ],
    },
    lagrange: {
      examples: [
        {
          name: "Example 1: 3 Points",
          inputs: {
            size: 3,
            x: [[1, 2, 3]],
            y: [[1, 4, 9]],
            target_x: 2.5,
          },
        },
        {
          name: "Example 2: 4 Points",
          inputs: {
            size: 4,
            x: [[0, 1, 2, 3]],
            y: [[1, 2, 4, 8]],
            target_x: 1.5,
          },
        },
      ],
    },
  },
  regression: {
    least_square: {
      examples: [
        {
          name: "Example 1: Linear Fit",
          inputs: {
            x: [[1], [2], [3], [4], [5]],
            y: [[2], [4], [5], [7], [9]],
            degree: 1,
          },
        },
        {
          name: "Example 2: Quadratic Fit",
          inputs: {
            x: [[1], [2], [3], [4], [5]],
            y: [[1], [4], [9], [16], [25]],
            degree: 2,
          },
        },
      ],
    },
  },
  integration: {
    trapezodial: {
      examples: [
        {
          name: "Example 1: x^2",
          inputs: {
            equation: "x^2",
            xl: 0,
            xr: 1,
            trapezoid_count: 10,
          },
        },
        {
          name: "Example 2: sin(x)",
          inputs: {
            equation: "sin(x)",
            xl: 0,
            xr: 3.14159,
            trapezoid_count: 20,
          },
        },
      ],
    },
  },
  differential: {
    derivative: {
      examples: [
        {
          name: "Example 1: x^2 at x=2",
          inputs: {
            equation: "x^2",
            x: 2,
            h: 0.01,
            method_type: 3, // Central difference
            precision_type: 1, // 1st precision
            diff_times: 1, // First derivative
          },
        },
        {
          name: "Example 2: sin(x) at x=π/4",
          inputs: {
            equation: "sin(x)",
            x: 0.7853981634, // π/4
            h: 0.001,
            method_type: 3, // Central difference
            precision_type: 2, // 2nd precision
            diff_times: 1, // First derivative
          },
        },
      ],
    },
  },
}