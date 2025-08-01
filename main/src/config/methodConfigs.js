import { inputSchemas } from "./inputSchemas";
import { ioSchemas } from "./ioSchemas";
import { exampleSchemas } from "./exampleSchemas";
import MethodPage from "../pages/MethodPage";

import { derivative, parse } from "mathjs";
import nerdamer from "nerdamer";
// @ts-ignore
import "nerdamer/Calculus";

export const methodConfigs = {
  root_equation: {
    bisection: {
      route: "/bisection",
      methodName: "Bisection",
      methodSchema: inputSchemas.root_equation.bisection,
      ioSchema: ioSchemas.root_equation.bisection,
      exampleSchema: exampleSchemas.root_equation.bisection,
      component: MethodPage,
    },
    false_position: {
      route: "/false_position",
      methodName: "False Position",
      methodSchema: inputSchemas.root_equation.false_position,
      ioSchema: ioSchemas.root_equation.false_position,
      exampleSchema: exampleSchemas.root_equation.false_position,
      component: MethodPage,
    },
    fixed_point: {
      route: "/fixed_point",
      methodName: "Fixed point iteration",
      methodSchema: inputSchemas.root_equation.fixed_point,
      ioSchema: ioSchemas.root_equation.fixed_point,
      exampleSchema: exampleSchemas.root_equation.fixed_point,
      component: MethodPage,
    },
    taylor: {
      route: "/taylor",
      methodName: "Taylor series",
      methodSchema: inputSchemas.root_equation.taylor,
      ioSchema: ioSchemas.root_equation.taylor,
      exampleSchema: exampleSchemas.root_equation.taylor,
      externalParams: { equations: [] },
      onInput: (ctx) => {
        const { equation } = ctx;
        const MAX_LOOP = 4;
        let equations = [equation];
        
        let diff_string = equation;
        let iter = 1;
        
        // ln (neutral log) unusual case (mathjs NOT SUPPORTED)
        // ln(x) dx -> 1/x 
        diff_string = diff_string.replace(/ln\s*\(([^)]+)\)/g, 'log($1)');
    
        while (iter < MAX_LOOP) {
          let node = parse(diff_string);
          node = derivative(node, 'x');
    
          diff_string = node.toString();
          equations.push(diff_string);
    
          if (diff_string === '0') break;
          iter++;
        }
        return { equations: equations };
      },
      component: MethodPage,
    },
    newton_raphson: {
      route: "/newton_raphson",
      methodName: "Newton raphson",
      methodSchema: inputSchemas.root_equation.newton_raphson,
      ioSchema: ioSchemas.root_equation.newton_raphson,
      exampleSchema: exampleSchemas.root_equation.newton_raphson,
      externalParams: { equation_diff: '' },
      onInput: (ctx) => {
        const { equation } = ctx;
        let node = parse(equation);
        node = derivative(node, 'x');
        return { equation_diff: node.toString() };
      },
      component: MethodPage,
    },
    secant: {
      route: "/secant",
      methodName: "Secant",
      methodSchema: inputSchemas.root_equation.secant,
      ioSchema: ioSchemas.root_equation.secant,
      exampleSchema: exampleSchemas.root_equation.secant,
      component: MethodPage,
    }
  },
  linear_equation: {
    cramer: {
      route: "/cramer",
      methodName: "Cramer",
      methodSchema: inputSchemas.linear_equation.cramer,
      ioSchema: ioSchemas.linear_equation.cramer,
      exampleSchema: exampleSchemas.linear_equation.cramer,
      component: MethodPage,
    },
    guass_naive: {
      route: "/guass_naive",
      methodName: "Naive Guassian",
      methodSchema: inputSchemas.linear_equation.guass_naive,
      ioSchema: ioSchemas.linear_equation.guass_naive,
      exampleSchema: exampleSchemas.linear_equation.guass_naive,
      component: MethodPage,
    },
    cramer: {
      route: "/guass_jordan",
      methodName: "Guassian Jordan",
      methodSchema: inputSchemas.linear_equation.guass_jordan,
      ioSchema: ioSchemas.linear_equation.guass_jordan,
      exampleSchema: exampleSchemas.linear_equation.guass_naive,
      component: MethodPage,
    },
    inverse: {
      route: "/inverse",
      methodName: "Inverse matrix",
      methodSchema: inputSchemas.linear_equation.inverse,
      ioSchema: ioSchemas.linear_equation.inverse,
      exampleSchema: exampleSchemas.linear_equation.guass_naive,
      component: MethodPage,
    },
    LU: {
      route: "/lu",
      methodName: "LU-Decomposition",
      methodSchema: inputSchemas.linear_equation.LU,
      ioSchema: ioSchemas.linear_equation.LU,
      exampleSchema: exampleSchemas.linear_equation.guass_naive,
      component: MethodPage,
    },
    cholesky: {
      route: "/cholesky",
      methodName: "Cholesky",
      methodSchema: inputSchemas.linear_equation.cholesky,
      ioSchema: ioSchemas.linear_equation.cholesky,
      exampleSchema: exampleSchemas.linear_equation.cramer,
      component: MethodPage,
    },
    jacobi: {
      route: "/jacobi",
      methodName: "Jacobi",
      methodSchema: inputSchemas.linear_equation.jacobi,
      ioSchema: ioSchemas.linear_equation.jacobi,
      exampleSchema: exampleSchemas.linear_equation.cramer,
      component: MethodPage,
    },
    guass_seidel: {
      route: "/guass_seidel",
      methodName: "Guass seidel",
      methodSchema: inputSchemas.linear_equation.guass_seidel,
      ioSchema: ioSchemas.linear_equation.guass_seidel,
      exampleSchema: exampleSchemas.linear_equation.guass_naive,
      component: MethodPage,
    },
    over_relaxation: {
      route: "/over_relaxation",
      methodName: "Successive over relaxation",
      methodSchema: inputSchemas.linear_equation.over_relaxation,
      ioSchema: ioSchemas.linear_equation.over_relaxation,
      exampleSchema: exampleSchemas.linear_equation.cramer,
      component: MethodPage,
    },
    conjugate_gradient: {
      route: "/conjugate_gradient",
      methodName: "Successive over relaxation",
      methodSchema: inputSchemas.linear_equation.conjugate_gradient,
      ioSchema: ioSchemas.linear_equation.conjugate_gradient,
      exampleSchema: exampleSchemas.linear_equation.guass_naive,
      component: MethodPage,
    }
  },
  interpolation: {
    newton_divided: {
      route: "/newton_divided",
      methodName: "Newton divided",
      methodSchema: inputSchemas.interpolation.newton_divided,
      ioSchema: ioSchemas.interpolation.newton_divided,
      exampleSchema: exampleSchemas.interpolation.newton_divided,
      component: MethodPage,
    },
    lagrange: {
      route: "/lagrange",
      methodName: "Lagrange",
      methodSchema: inputSchemas.interpolation.lagrange,
      ioSchema: ioSchemas.interpolation.lagrange,
      exampleSchema: exampleSchemas.interpolation.lagrange,
      component: MethodPage,
    },
    spline: {
      route: "/spline",
      methodName: "Successive over relaxation",
      methodSchema: inputSchemas.interpolation.spline,
      ioSchema: ioSchemas.interpolation.spline,
      exampleSchema: exampleSchemas.interpolation.guass_naive,
      component: MethodPage,
    }
  },
  regression: {
    least_square: {
      route: "/least_square",
      methodName: "Least square regression",
      methodSchema: inputSchemas.regression.least_square,
      ioSchema: ioSchemas.regression.least_square,
      exampleSchema: exampleSchemas.regression.least_square,
      component: MethodPage
    },
    multi_least_square: {
      route: "/multi_least_square",
      methodName: "Least square regression",
      methodSchema: inputSchemas.regression.multi_least_square,
      ioSchema: ioSchemas.regression.multi_least_square,
      exampleSchema: exampleSchemas.regression.least_square,
      component: MethodPage
    },
    degree_combinations: {
      route: "/degree_combinations",
      methodName: "Pseudo degree combinations",
      methodSchema: inputSchemas.regression.degree_combinations,
      ioSchema: ioSchemas.regression.degree_combinations,
      exampleSchema: exampleSchemas.regression.degree_combinations,
      component: MethodPage
    },
  },
  integration: {
    trapezodial: {
      route: "/trapezodial",
      methodName: "Trapezodial Integration",
      methodSchema: inputSchemas.integration.trapezodial,
      ioSchema: ioSchemas.integration.trapezodial,
      exampleSchema: exampleSchemas.integration.trapezodial,
      externalParams: { true_result: NaN },
      onInput: (ctx) => {
        const { equation, xl, xr } = ctx;
        const result = nerdamer(`defint(${equation}, ${xl}, ${xr})`).evaluate().text();
        return { true_result: result };
      },
      component: MethodPage,
    },
    simpson_1in3: {
      route: "/simpson_1in3",
      methodName: "Simpson's 1/3 Rule",
      methodSchema: inputSchemas.integration.simpson_1in3,
      ioSchema: ioSchemas.integration.simpson_1in3,
      exampleSchema: exampleSchemas.integration.trapezodial,
      externalParams: { true_result: NaN },
      onInput: (ctx) => {
        const { equation, xl, xr } = ctx;
        const result = nerdamer(`defint(${equation}, ${xl}, ${xr})`).evaluate().text();
        return { true_result: result };
      },
      component: MethodPage,
    },
    simpson_3in8: {
      route: "/simpson_3in8",
      methodName: "Simpson's 3/8 Rule",
      methodSchema: inputSchemas.integration.simpson_3in8,
      ioSchema: ioSchemas.integration.simpson_3in8,
      exampleSchema: exampleSchemas.integration.trapezodial,
      externalParams: { true_result: NaN },
      onInput: (ctx) => {
        const { equation, xl, xr } = ctx;
        const result = nerdamer(`defint(${equation}, ${xl}, ${xr})`).evaluate().text();
        return { true_result: result };
      },
      component: MethodPage,
    },
    romberg: {
      route: "/romberg",
      methodName: "Romberg Integration",
      methodSchema: inputSchemas.integration.romberg,
      ioSchema: ioSchemas.integration.romberg,
      exampleSchema: exampleSchemas.integration.romberg,
      externalParams: { true_result: NaN },
      onInput: (ctx) => {
        const { equation, xl, xr } = ctx;
        const result = nerdamer(`defint(${equation}, ${xl}, ${xr})`).evaluate().text();
        return { true_result: result };
      },
      component: MethodPage,
    },
    romberg: {
      route: "/romberg",
      methodName: "Romberg Integration",
      methodSchema: inputSchemas.integration.romberg,
      ioSchema: ioSchemas.integration.romberg,
      exampleSchema: exampleSchemas.integration.romberg,
      externalParams: { true_result: NaN },
      onInput: (ctx) => {
        const { equation, xl, xr } = ctx;
        const result = nerdamer(`defint(${equation}, ${xl}, ${xr})`).evaluate().text();
        return { true_result: result };
      },
      component: MethodPage,
    },
    guass: {
      route: "/guass",
      methodName: "Guass Integration",
      methodSchema: inputSchemas.integration.guass,
      ioSchema: ioSchemas.integration.guass,
      exampleSchema: exampleSchemas.integration.trapezodial,
      externalParams: { true_result: NaN },
      onInput: (ctx) => {
        const { equation, xl, xr } = ctx;
        const result = nerdamer(`defint(${equation}, ${xl}, ${xr})`).evaluate().text();
        return { true_result: result };
      },
      component: MethodPage,
    },
  },
  differential: {
    derivative: {
      route: "/derivative",
      methodName: "Finite Difference Method",
      methodSchema: inputSchemas.differential.derivative,
      ioSchema: ioSchemas.differential.derivative,
      exampleSchema: exampleSchemas.differential.derivative,
      externalParams: { true_result: NaN },
      onInput: (ctx) => {
        let node = parse(ctx.equation);
        for (let i = 0; i < ctx.diff_times; i++) {
          node = derivative(node, "x");
        }
        return { true_result: node.evaluate({ x: ctx.x }) };
      },
      component: MethodPage,
    },
  }
}
