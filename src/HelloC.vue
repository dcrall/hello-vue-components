<template>
  <div :class="$style.hello">
    HelloC
  </div>
</template>

<style module>
    .hello {
        color: blue;
    }
</style>

<meta>
{
"description": "A component that says \"HelloC\" with blue text."
}
</meta>

<example>
    <!-- No props or content are necessary. -->
    <hello-c></hello-c>
</example>
