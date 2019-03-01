#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in vec4 vs_T0; // first column of transform matrix
in vec4 vs_T1; // second column of transform matrix
in vec4 vs_T2; // third column of transform matrix
in vec4 vs_T3; // fourth column of transform matrix
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

out vec4 fs_Col;
out vec4 fs_Pos;
out vec4 fs_Nor;
out vec4 fs_LightVec; 

vec3 lightPos = vec3(5.0, -3.0, 10.0);
void main()
{
    fs_Col = vs_Col;
    fs_Pos = vs_Pos;
    mat4 T = mat4(vs_T0, vs_T1, vs_T2, vs_T3);
    fs_Nor = normalize(vec4(transpose(inverse(T)) * vs_Nor)); 

    vec4 modelposition = T * vs_Pos;
	fs_LightVec = vec4(lightPos, 1.0) - modelposition;
    gl_Position = u_ViewProj * T * vs_Pos;
}
