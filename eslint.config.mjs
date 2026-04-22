import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // console.log 경고 (배포 전 제거 유도)
      "no-console": "warn",

      // 사용하지 않는 변수 경고
      "no-unused-vars": "warn",

      // var 사용 금지 (const, let 사용)
      "no-var": "error",

      // const 사용 가능하면 const 강제
      "prefer-const": "error",

      // 화살표 함수 괄호 (항상 괄호 사용)
      "arrow-parens": ["error", "always"],

      // 동등 연산자 === 강제 (== 금지)
      eqeqeq: "error",

      // React import 생략 허용 (Next.js는 자동 import)
      "react/react-in-jsx-scope": "off",

      // props 타입 정의 강제 해제 (TypeScript 쓰니까)
      "react/prop-types": "off",

      // 빈 인터페이스 금지
      "@typescript-eslint/no-empty-interface": "warn",

      // any 타입 경고
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
